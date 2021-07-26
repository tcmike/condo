/**
 * Generated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 */

const { Text, Checkbox, Password, File, Select, Virtual } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const { EMAIL_WRONG_FORMAT_ERROR } = require('@condo/domains/common/constants/errors')
const access = require('@condo/domains/user/access/User')
const { normalizePhone } = require('@condo/domains/common/utils/phone')

const FileAdapter = require('@condo/domains/common/utils/fileAdapter')
const { updateEmployeesRelatedToUser } = require('@condo/domains/user/utils/serverSchema')
const { triggersManager } = require('@core/triggers')
const { normalizeEmail } = require('@condo/domains/common/utils/mail')
const AVATAR_FILE_ADAPTER = new FileAdapter('avatars')

const User = new GQLListSchema('User', {
    schemaDoc: 'Individual / person / service account / impersonal company account',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        name: {
            schemaDoc: 'Name. If impersonal account should be a company name',
            type: Text,
        },
        hasEmail: {
            type: Virtual,
            resolver: (item) => Boolean(item.email),
            args: [{ name: 'formatAs', type: 'String' }],
            access: true,
        },
        password: {
            schemaDoc: 'Password. Update only',
            type: Password,
            access: access.canAccessToPasswordField,
        },
        type: {
            schemaDoc: 'Field that allows you to distinguish CRM users from mobile app users',
            type: Select,
            dataType: 'enum',
            options: ['staff', 'resident'],
            defaultValue: 'staff',
            isRequired: true,
        },
        // TODO(pahaz): useless! remove it or write auth checks!
        isActive: {
            schemaDoc: 'Can logged in?',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsAdminField,
        },

        isAdmin: {
            schemaDoc: 'Superuser access to service data',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsAdminField,
        },

        isSupport: {
            schemaDoc: 'Can access to "/admin/" panel. And do support tasks',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsAdminField,
        },

        email: {
            schemaDoc: 'Email. Transformed to lower case',
            type: Text,
            access: access.canAccessToEmailField,
            kmigratorOptions: { null: true, unique: true },
            hooks: {
                resolveInput: ({ resolvedData }) => {
                    return normalizeEmail(resolvedData['email']) || resolvedData['email']
                },
                validateInput: async ({ resolvedData, addFieldValidationError }) => {
                    if (resolvedData['email'] && normalizeEmail(resolvedData['email']) !== resolvedData['email']) {
                        addFieldValidationError(`${EMAIL_WRONG_FORMAT_ERROR}mail] invalid format`)
                    }
                },
            },
        },

        isEmailVerified: {
            schemaDoc: 'Email verification flag. User verify email by access to secret link',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsEmailVerifiedField,
        },
        // Phone needs to be uniq together with type field. Keystone do not support multi fields indexes
        phone: {
            schemaDoc: 'Phone. In international E.164 format without spaces',
            type: Text,
            access: access.canAccessToPhoneField,
            kmigratorOptions: { null: true, unique: false },
            hooks: {
                resolveInput: ({ resolvedData }) => {
                    return normalizePhone(resolvedData['phone'])
                },
            },
        },

        isPhoneVerified: {
            schemaDoc: 'Phone verification flag. User verify phone by access to secret sms message',
            type: Checkbox,
            defaultValue: false,
            access: access.canAccessToIsPhoneVerifiedField,
        },

        avatar: {
            schemaDoc: 'User loaded avarat image',
            type: File,
            adapter: AVATAR_FILE_ADAPTER,
        },

        meta: {
            schemaDoc: 'User metadata. Example: `city`, `country`, ...',
            type: Json,
            // TODO(pahaz): we should check the structure!
        },

        // TODO(pahaz): should we also add remote system?
        importId: {
            schemaDoc: 'External system user id. Used for integrations',
            type: Text,
            access: access.canAccessToImportIdField,
            kmigratorOptions: { null: true, unique: true },
        },

    },
    hooks: {
        afterChange: async ({ updatedItem, context, existingItem, operation }) => {
            if (
                operation === 'update' && existingItem &&
                (updatedItem.phone !== existingItem.phone ||
                updatedItem.email !== existingItem.email ||
                updatedItem.name !== existingItem.name)
            ) {
                await updateEmployeesRelatedToUser(context, updatedItem)
            }
        },
        resolveInput: async ({ operation, listKey, context, resolvedData, existingItem }) => {
            await triggersManager.executeTrigger({ operation, data: { resolvedData, existingItem }, listKey }, context)

            return resolvedData
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadUsers,
        create: access.canManageUsers,
        update: access.canManageUsers,
        delete: false,
        auth: true,
    },
})

module.exports = {
    User,
}
