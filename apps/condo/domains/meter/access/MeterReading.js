/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */
const { ServiceConsumer } = require('@condo/domains/resident/utils/serverSchema')
const { Meter } = require('../utils/serverSchema')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { checkPermissionInUserOrganizationOrRelatedOrganization } = require('../../organization/utils/accessSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { queryOrganizationEmployeeFromRelatedOrganizationFor, queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')
const { Resident: ResidentServerUtils } = require('@condo/domains/resident/utils/serverSchema')
const { get } = require('lodash')


async function canReadMeterReadings ({ authentication: { item: user }, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin || user.isSupport) return {}

    const userId = user.id
    if (user.type === RESIDENT) {
        const residents = await ResidentServerUtils.getAll(context, { user: { id: userId } })

        for (const resident of residents) {
            const residentPropertyId = get(resident, ['property', 'id'])
            const residentUnitName = get(resident, 'unitName')

            const serviceConsumers = await ServiceConsumer.getAll(context, {
                resident: { id: resident.id },
            })
            const serviceConsumerAccounts = serviceConsumers.map(serviceConsumer => serviceConsumer.accountNumber)

            const meters = await Meter.getAll(context, {
                property: { id: residentPropertyId },
                unitName: residentUnitName,
                accountNumber_in: serviceConsumerAccounts,
            })

            if (meters.length > 0) return {}
        }
    }

    return {
        organization: {
            OR: [
                queryOrganizationEmployeeFor(userId),
                queryOrganizationEmployeeFromRelatedOrganizationFor(userId),
            ],
        },
    }
}

async function canManageMeterReadings ({ authentication: { item: user }, originalInput, operation, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return true

    if (operation === 'create') {
        const organizationIdFromMeterReading = get(originalInput, ['organization', 'connect', 'id'])
        if (!organizationIdFromMeterReading)
            return false

        const meterId = get(originalInput, ['meter', 'connect', 'id'])
        const [meter] = await Meter.getAll(context, { id: meterId })
        if (!meter)
            return false

        const organizationPermission =
            await checkPermissionInUserOrganizationOrRelatedOrganization(context, user.id, organizationIdFromMeterReading, 'canManageMeterReadings')
        if (organizationPermission)
            return true

        if (user.type === RESIDENT) {
            const residents = await ResidentServerUtils.getAll(context, {
                user: { id: user.id },
                property: { id: meter.property.id },
                unitName: meter.unitName,
            })

            for (const resident of residents) {
                const residentPropertyId = get(resident, ['property', 'id'])
                const residentUnitName = get(resident, 'unitName')

                const serviceConsumers = await ServiceConsumer.getAll(context, {
                    resident: { id: resident.id },
                })
                const serviceConsumerAccounts = serviceConsumers.map(serviceConsumer => serviceConsumer.accountNumber)

                const meters = await Meter.getAll(context, {
                    property: { id: residentPropertyId },
                    unitName: residentUnitName,
                    accountNumber_in: serviceConsumerAccounts,
                })

                if (meters.length > 0) return true
            }
        }
    }
    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadMeterReadings,
    canManageMeterReadings,
}
