/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */

const { Text, Relationship, Integer, Select, Checkbox, DateTimeUtc, CalendarDay, Decimal, Password, File } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const access = require('@condo/domains/meter/access/MeterReading')
const { ORGANIZATION_OWNED_FIELD } = require('../../../schema/_common')


const MeterReading = new GQLListSchema('MeterReading', {
    schemaDoc: 'Meter reading taken from a client or billing',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        organization: ORGANIZATION_OWNED_FIELD,

        property: {
            schemaDoc: 'Property related to the MeterReading',
            type: Relationship,
            ref: 'Property',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        account: {
            schemaDoc: 'Client\'s billing account',
            type: Relationship,
            ref: 'BillingAccount',
        },

        billingAccountMeter: {
            schemaDoc: 'Link to BillingAccountMeter if it exist in billing context',
            type: Relationship,
            ref: 'BillingAccountMeter',
        },

        date: {
            schemaDoc: 'Date when the readings were taken',
            type: DateTimeUtc,
            isRequired: true,
        },

        meter: {
            schemaDoc: 'Meter from which readings were taken',
            type: Relationship,
            ref: 'Meter',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.CASCADE' },
        },

        value: {
            schemaDoc: 'Numerical value on the meter at the time of taking readings',
            type: Integer,
            isRequired: true,
        },

        source: {
            schemaDoc: 'Meter reading source channel/system. Examples: call, mobile_app, billing, ...',
            type: Relationship,
            ref: 'MeterReadingSource',
            isRequired: true,
            knexOptions: { isNotNullable: true }, // Required relationship only!
            kmigratorOptions: { null: false, on_delete: 'models.PROTECT' },
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    access: {
        read: access.canReadMeterReadings,
        create: access.canManageMeterReadings,
        update: access.canManageMeterReadings,
        delete: false,
        auth: true,
    },
})

module.exports = {
    MeterReading,
}