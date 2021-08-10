/**
 * Generated by `createschema billing.BillingAccount 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; bindingId:Text; number:Text; unit:Text; raw:Json; meta:Json'`
 */

const { Text } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/billing/access/BillingAccount')
const { DV_UNKNOWN_VERSION_ERROR, JSON_EXPECT_OBJECT_ERROR, JSON_UNKNOWN_VERSION_ERROR } = require('@condo/domains/common/constants/errors')
const { hasRequestAndDbFields, hasValidJsonStructure } = require('@condo/domains/common/utils/validation.utils')
const { INTEGRATION_CONTEXT_FIELD, IMPORT_ID_FIELD, BILLING_PROPERTY_FIELD, RAW_DATA_FIELD } = require('./fields')


const BillingAccount = new GQLListSchema('BillingAccount', {
    schemaDoc: 'All `account` objects from `billing data source`. In close account cases, these objects should be soft deleted',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        context: INTEGRATION_CONTEXT_FIELD,

        importId: IMPORT_ID_FIELD,

        raw: RAW_DATA_FIELD,

        property: BILLING_PROPERTY_FIELD,

        globalId: {
            schemaDoc: 'A well-known universal identifier that allows you to identify the same objects in different systems. It may differ in different countries. ' +
                'Example: for Russia, the dom.gosuslugi.ru account number is used',
            type: Text,
            isRequired: false,
            kmigratorOptions: { unique: true, null: true },
        },

        number: {
            schemaDoc: 'Account number',
            type: Text,
            isRequired: true,
        },

        // TODO(pahaz): make a link to property domain fields
        unitName: {
            schemaDoc: 'Flat number / door number of an apartment building (property)',
            type: Text,
            isRequired: true,
        },

        meta: {
            schemaDoc: 'Structured metadata obtained from the `billing data source`. Some of this data is required for use in the `receipt template`. ' +
                'Examples of data keys: `property unit number`, `floor`, `entrance`, `is parking`',
            type: Json,
            isRequired: true,
            hooks: {
                validateInput: (args) => {
                    const { resolvedData, fieldPath, addFieldValidationError } = args
                    if (!resolvedData.hasOwnProperty(fieldPath)) return // skip if on value
                    const value = resolvedData[fieldPath]
                    if (value === null) return // null is OK
                    if (!hasValidJsonStructure(args, true, 1, {}))
                        return addFieldValidationError(`${JSON_EXPECT_OBJECT_ERROR}${fieldPath}] ${fieldPath} field type error. We expect JSON Object`)
                    const { dv } = value
                    if (dv !== 1) {
                        return addFieldValidationError(`${JSON_UNKNOWN_VERSION_ERROR}${fieldPath}] Unknown \`dv\` attr inside JSON Object`)
                    }
                },
            },
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadBillingAccounts,
        create: access.canManageBillingAccounts,
        update: access.canManageBillingAccounts,
        delete: false,
        auth: true,
    },
    hooks: {
        validateInput: ({ resolvedData, existingItem, context, addValidationError }) => {
            if (!hasRequestAndDbFields([{ field: 'dv', checkCookies: true }, { field: 'sender', checkCookies: true }], [], resolvedData, existingItem, context, addValidationError)) return
            const { dv } = resolvedData
            if (dv === 1) {
                // NOTE: version 1 specific translations. Don't optimize this logic
            } else {
                return addValidationError(`${DV_UNKNOWN_VERSION_ERROR}dv] Unknown \`dv\``)
            }
        },
    },
})

module.exports = {
    BillingAccount,
}
