/**
 * Generated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 */

const get = require('lodash/get')
const uniq = require('lodash/uniq')
const compact = require('lodash/compact')
const omit = require('lodash/omit')
const isEmpty = require('lodash/isEmpty')
const { queryOrganizationEmployeeFromRelatedOrganizationFor } = require('@condo/domains/organization/utils/accessSchema')
const { queryOrganizationEmployeeFor } = require('@condo/domains/organization/utils/accessSchema')
const { checkRelatedOrganizationPermission } = require('../../organization/utils/accessSchema')
const { getById } = require('@core/keystone/schema')
const { checkOrganizationPermission } = require('@condo/domains/organization/utils/accessSchema')
const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { Resident: ResidentServerUtils } = require('@condo/domains/resident/utils/serverSchema')

async function canReadTickets ({ authentication: { item: user }, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin || user.isSupport) {
        return {}
    }
    const userId = get(user, 'id', null)

    if (user.type === RESIDENT) {
        const residents = await ResidentServerUtils.getAll(context, { user: { id: userId }, deletedAt: null })
        if (residents.length === 0) {
            return false
        }

        const organizationIds = compact(residents.map(resident => get(resident, ['organization', 'id'])))
        if (organizationIds.length > 0) {
            return {
                organization: {
                    id_in: uniq(organizationIds),
                },
                createdBy: { id: userId },
                deletedAt: null,
            }
        }
        return false
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

async function canManageTickets ({ authentication: { item: user }, operation, itemId, originalInput, context }) {
    if (!user) return throwAuthenticationError()
    if (user.isAdmin) return true
    const userId = get(user, 'id', null)

    if (operation === 'create') {
        const organizationIdFromTicket = get(originalInput, ['organization', 'connect', 'id'])
        if (!organizationIdFromTicket) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        const property = await getById('Property', propertyId)
        if (!property) {
            return false
        }

        if (user.type === RESIDENT) {
            const ticketUnitName = get(originalInput, 'unitName', null)
            if (!ticketUnitName) return false

            const residents = await ResidentServerUtils.getAll(context, {
                user: {
                    id: userId,
                },
                property: {
                    id: propertyId,
                },
                unitName: ticketUnitName,
            })

            return residents.length > 0
        }

        const canManageRelatedOrganizationTickets = await checkRelatedOrganizationPermission(context, userId, organizationIdFromTicket, 'canManageTickets')
        if (canManageRelatedOrganizationTickets) {
            return true
        }

        const organizationIdFromProperty = get(property, 'organization')
        const canManageTickets = await checkOrganizationPermission(context, userId, organizationIdFromTicket, 'canManageTickets')
        if (!canManageTickets) {
            return false
        }

        return organizationIdFromTicket === organizationIdFromProperty

    } else if (operation === 'update') {
        if (!itemId) {
            return false
        }

        const ticket = await getById('Ticket', itemId)
        if (!ticket) {
            return false
        }

        const organizationIdFromTicket = get(ticket, 'organization', null)

        if (ticket.createdBy === userId && user.type === RESIDENT) {
            const inaccessibleUpdatedFields = omit(originalInput, ['dv', 'sender', 'details'])
            if (!isEmpty(inaccessibleUpdatedFields)) {
                return false
            }

            const propertyIdFromTicket = get(ticket, 'property', null)
            const unitNameFromTicket = get(ticket, 'unitName', null)
            const residents = await ResidentServerUtils.getAll(context, {
                user: {
                    id: userId,
                },
                property: {
                    id: propertyIdFromTicket,
                },
                unitName: unitNameFromTicket,
            })

            return residents.length > 0
        }

        const canManageRelatedOrganizationTickets = await checkRelatedOrganizationPermission(context, userId, organizationIdFromTicket, 'canManageTickets')
        if (canManageRelatedOrganizationTickets) {
            return true
        }

        const canManageTickets = await checkOrganizationPermission(context, userId, organizationIdFromTicket, 'canManageTickets')
        if (!canManageTickets) {
            return false
        }

        const propertyId = get(originalInput, ['property', 'connect', 'id'])
        if (propertyId) {
            const property = await getById('Property', propertyId)
            if (!property) {
                return false
            }

            const organizationIdFromProperty = get(property, 'organization')
            const isSameOrganization = organizationIdFromTicket === organizationIdFromProperty

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
    canReadTickets,
    canManageTickets,
}
