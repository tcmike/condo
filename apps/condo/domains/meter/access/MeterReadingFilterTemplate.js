// @ts-nocheck
/**
 * Generated by `createschema meter.MeterReadingFilterTemplate 'name:Text; employee:Relationship:OrganizationEmployee:CASCADE; filters:Json'`
 */

const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { getByCondition, getById } = require('@core/keystone/schema')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')

async function canReadMeterReadingFilterTemplates ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return {}

    return {
        employee: { organization: { ...queryOrganizationEmployeeFor(user.id) } },
        createdBy: { id: user.id },
    }
}

async function canManageMeterReadingFilterTemplates ({ authentication: { item: user }, originalInput, operation, itemId }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return true

    if (operation === 'create') {
        const employeeForUser = await getByCondition('OrganizationEmployee', {
            id: originalInput.employee.connect.id,
            user: { id: user.id },
            deletedAt: null,
            isBlocked: false,
        })

        if (!employeeForUser || employeeForUser.isBlocked) {
            return false
        }

        return true
    } else if (operation === 'update') {
        if (!itemId) return false
        const templateToEdit = await getById('MeterReadingFilterTemplate', itemId)

        const employeeForUser = await getByCondition('OrganizationEmployee', {
            id: templateToEdit.employee,
            user: { id: user.id },
            deletedAt: null,
            isBlocked: false,
        })

        if (!employeeForUser || employeeForUser.isBlocked) {
            return false
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
    canReadMeterReadingFilterTemplates,
    canManageMeterReadingFilterTemplates,
}