/**
 * Generated by `createschema ticket.TicketProblemClassifier 'organization?:Relationship:Organization:CASCADE;name:Text;'`
 */

const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')

async function canReadTicketProblemClassifiers ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    return {}
}

async function canManageTicketProblemClassifiers ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false

    return !!(user.isSupport || user.isAdmin)
}

/*
Rules are logical functions that used for list access, and may return a boolean (meaning
all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadTicketProblemClassifiers,
    canManageTicketProblemClassifiers,
}
