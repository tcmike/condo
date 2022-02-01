/**
 * Generated by `createservice user.RegisterNewServiceUserService`
 */

const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/user/access/RegisterNewServiceUserService')


const RegisterNewServiceUserService = new GQLCustomSchema('RegisterNewServiceUserService', {
    types: [
        {
            access: true,
            // TODO(codegen): write RegisterNewServiceUserService input !
            type: 'input RegisterNewUserServiceInput { dv: Int!, sender: JSON! }',
        },
        {
            access: true,
            // TODO(codegen): write RegisterNewServiceUserService output !
            type: 'type RegisterNewUserServiceOutput { id: String! }',
        },
    ],
    
    mutations: [
        {
            access: access.canRegisterNewUserService,
            schema: 'registerNewUserService(data: RegisterNewUserServiceInput!): RegisterNewUserServiceOutput',
            resolver: async (parent, args, context, info, extra = {}) => {
                // TODO(codegen): write RegisterNewServiceUserService logic!
                const { data } = args
                return {
                    id: null,
                }
            },
        },
    ],
    
})

module.exports = {
    RegisterNewServiceUserService,
}
