/**
 * Generated by `createservice property.CheckPropertyWithAddressExistService --type queries`
 */

const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/property/access/CheckPropertyWithAddressExistService')
const { Property } = require('@condo/domains/property/utils/serverSchema')


const CheckPropertyWithAddressExistService = new GQLCustomSchema('CheckPropertyWithAddressExistService', {
    types: [
        {
            access: true,
            type: 'input CheckPropertyWithAddressExistInput { address: String! }',
        },
        {
            access: true,
            type: 'type CheckPropertyWithAddressExistOutput { find: Boolean! }',
        },
    ],
    
    queries: [
        {
            access: access.canCheckPropertyWithAddressExist,
            schema: 'checkPropertyWithAddressExist (data: CheckPropertyWithAddressExistInput!): CheckPropertyWithAddressExistOutput',
            resolver: async (parent, args, context = {}) => {
                const { data } = args
                const { address } = data
                const foundAmount = await Property.count(context, {
                    address,
                })
                return {
                    find: foundAmount > 0,
                }
            },
        },
    ],
    
})

module.exports = {
    CheckPropertyWithAddressExistService,
}
