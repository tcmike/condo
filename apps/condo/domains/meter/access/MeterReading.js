// @ts-nocheck
const { MeterReading } = require('../utils/serverSchema')
const { queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const get = require('lodash/get')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { checkRelatedOrganizationPermission } = require('../../organization/utils/accessSchema')
const { getById } = require('@core/keystone/schema')
const { checkOrganizationPermission } = require('@condo/domains/organization/utils/accessSchema')
const { Meter } = require('../utils/serverSchema')
const { Property } = require('@condo/domains/property/utils/serverSchema')
/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */

async function canReadMeterReadings ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin || user.isSupport) {
        return {}
    }
    if (user.type === RESIDENT) {
        return {
            createdBy: { id: user.id },
        }
    }
    const userId = user.id
    return {
        organization: {
            OR: [
                queryOrganizationEmployeeFor(userId),
                queryOrganizationEmployeeFromRelatedOrganizationFor(userId),
            ],
        },
    }
}

async function canManageMeterReadings ({ authentication: { item: user }, originalInput, operation, itemId, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin || user.isSupport) return true
    if (operation === 'create') {
        const organizationIdFromMeter = get(originalInput, ['organization', 'connect', 'id'])
        if (!organizationIdFromMeter) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])

        const [property] = await Property.getAll(context, { id: propertyId })
        if (!property) {
            return false
        }
        if (user.type === RESIDENT) {
            return true
        }
        const canManageRelatedOrganizationTickets = await checkRelatedOrganizationPermission(context, user.id, organizationIdFromMeter, 'canManageMeters')
        if (canManageRelatedOrganizationTickets) {
            return true
        }
        const organizationIdFromProperty = get(property, ['organization', 'id'])
        const canManageMeterReadings = await checkOrganizationPermission(context, user.id, organizationIdFromMeter, 'canManageMeters')
        if (!canManageMeterReadings) {
            return false
        }

        return organizationIdFromMeter === organizationIdFromProperty

    } else if (operation === 'update') {
        if (!itemId) {
            return false
        }
        const meterReading = await MeterReading.getAll(context, { id: itemId })
        if (!meterReading) {
            return false
        }
        if (meterReading.createdBy === user.id && user.type === RESIDENT) {
            return true
        }

        const { organization: organizationIdFromMeterReading } = meterReading

        const canManageRelatedOrganizationTickets = await checkRelatedOrganizationPermission(context, user.id, organizationIdFromMeterReading, 'canManageMeters')
        if (canManageRelatedOrganizationTickets) {
            return true
        }
        const canManageMeters = await checkOrganizationPermission(context, user.id, organizationIdFromMeterReading, 'canManageMeters')
        if (!canManageMeters) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        if (propertyId) {
            const [property] = await Property.getAll(context, { id: propertyId })
            if (!property) {
                return false
            }

            const organizationIdFromProperty = get(property, ['organization', 'id'])
            const isSameOrganization = organizationIdFromMeterReading === organizationIdFromProperty

            if (!isSameOrganization) {
                return false
            }
        }

        return true
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