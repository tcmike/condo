/**
 * Generated by `createservice user.SupportMessagesForwardingService`
 */

const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/user/access/SupportMessagesForwardingService')


const SupportMessagesForwardingService = new GQLCustomSchema('SupportMessagesForwardingService', {
    types: [
        {
            access: true,
            type: 'input SupportMessagesForwardingFrom { organizationId: ID!, residentId: ID!, os: String!, appVersion: String! }',
        },
        {
            access: true,
            type: 'input SupportMessagesForwardingInput { dv: Int!, sender: JSON!, text: String!, email: String, attachments: [Upload], from: SupportMessagesForwardingFrom!, meta: JSON! }',
        },
        {
            access: true,
            type: 'type SupportMessagesForwardingOutput { status: String! }',
        },
    ],
    
    mutations: [
        {
            access: access.canSupportMessagesForwarding,
            schema: 'supportMessagesForwarding(data: SupportMessagesForwardingInput!): SupportMessagesForwardingOutput',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { data } = args
                return {
                    id: null,
                }
            },
        },
    ],
    
})

module.exports = {
    SupportMessagesForwardingService,
}