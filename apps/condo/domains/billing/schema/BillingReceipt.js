/**
 * Generated by `createschema billing.BillingReceipt 'context:Relationship:BillingIntegrationOrganizationContext:CASCADE; importId?:Text; property:Relationship:BillingProperty:CASCADE; account:Relationship:BillingAccount:CASCADE; period:CalendarDay; raw:Json; toPay:Text; services:Json; meta:Json'`
 */

const { Text } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/billing/access/BillingReceipt')
const { validatePaymentDetails, validateServices, validateRecipient } = require('../utils/validation.utils')
const { hasDbFields, hasRequestFields } = require('@condo/domains/common/utils/validation.utils')
const { DV_UNKNOWN_VERSION_ERROR } = require('@condo/domains/common/constants/errors')
const { INTEGRATION_CONTEXT_FIELD, IMPORT_ID_FIELD, RAW_DATA_FIELD, BILLING_PROPERTY_FIELD, BILLING_ACCOUNT_FIELD, PERIOD_FIELD } = require('./fields')

const BillingReceipt = new GQLListSchema('BillingReceipt', {
    schemaDoc: 'Account monthly invoice document',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        context: INTEGRATION_CONTEXT_FIELD,
        property: BILLING_PROPERTY_FIELD,
        account: BILLING_ACCOUNT_FIELD,

        importId: IMPORT_ID_FIELD,
        period: PERIOD_FIELD,

        printableNumber: {
            schemaDoc: 'A number to print on the payment document.',
            type: Text,
            isRequired: false,
        },

        raw: RAW_DATA_FIELD,

        toPay: {
            schemaDoc: 'Total sum to pay. Usually counts as the sum of all services. Detail level 1.',
            type: Text,
            isRequired: true,
        },

        toPayDetails: {
            schemaDoc: 'Sum to pay details. Detail level 2',
            type: Json,
            isRequired: false,
            hooks: {
                validateInput: validatePaymentDetails,
            },
        },

        services: {
            schemaDoc: 'Services to pay for. Every service has id, name and toPay. Service may or may not have toPay detail. Detail level 3 and 4',
            type: Json,
            isRequired: false,
            hooks: {
                validateInput: validateServices,
            },
        },

        recipient: {
            schemaDoc: 'Billing account recipient. Should contain all meta information to identify the organization',
            type: Json,
            isRequired: true,
            hooks: {
                validateInput: validateRecipient,
            },
        },
    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadBillingReceipts,
        create: access.canManageBillingReceipts,
        update: access.canManageBillingReceipts,
        delete: false,
        auth: true,
    },
    hooks: {
        validateInput: ({ resolvedData, existingItem, context, addValidationError }) => {
            if (!hasRequestFields(['dv', 'sender'], resolvedData, context, addValidationError)) return
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
    BillingReceipt,
}
