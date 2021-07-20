/**
 * Generated by `createschema property.Resident 'organization:Relationship:Organization:PROTECT; property:Relationship:Property:PROTECT; contact:Relationship:Contact:SET_NULL; billingAccount?:Relationship:BillingAccount:SET_NULL; unitName:Text; name:Text; email:Text; phone:Text;'`
 */

const { Text, Relationship, Integer, Select, Checkbox, DateTimeUtc, CalendarDay, Decimal, Password, File } = require('@keystonejs/fields')
const { Json } = require('@core/keystone/fields')
const { GQLListSchema } = require('@core/keystone/schema')
const { historical, versioned, uuided, tracked, softDeleted } = require('@core/keystone/plugins')
const { SENDER_FIELD, DV_FIELD } = require('@condo/domains/common/schema/fields')
const { ORGANIZATION_OWNED_FIELD } = require('../../../schema/_common')
const access = require('@condo/domains/property/access/Resident')
const { ADDRESS_META_FIELD } = require('@condo/domains/common/schema/fields')
const { normalizeEmail } = require('@condo/domains/common/utils/mail')
const { PHONE_WRONG_FORMAT_ERROR, EMAIL_WRONG_FORMAT_ERROR } = require('@condo/domains/common/constants/errors')
const { normalizePhone } = require('@condo/domains/common/utils/phone')
const { Resident: ResidentAPI } = require('../utils/serverSchema')
const { Property } = require('../utils/serverSchema')

const Resident = new GQLListSchema('Resident', {
    schemaDoc: 'Person, that resides in a specified property and unit',
    fields: {
        dv: DV_FIELD,
        sender: SENDER_FIELD,

        organization: {
            schemaDoc: 'Organization, that provides service to this resident. Can be missing, when a resident has been registered, but there is no Organization, that serves specified address in our system yet',
            type: Relationship,
            ref: 'Organization',
            isRequired: false,
            knexOptions: { isNotNullable: false }, // Relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            access: {
                read: true,
                create: true,
                update: false,
            },
        },

        property: {
            schemaDoc: 'Property, in which this person resides. Can be missing, when a resident has been registered, but there is no Property in our system yet',
            type: Relationship,
            ref: 'Property',
            isRequired: false,
            knexOptions: { isNotNullable: false }, // Required relationship only!
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
            hooks: {
                validateInput: async ({ context, resolvedData, existingItem, addFieldValidationError }) => {
                    const newOrExistingPropertyId = resolvedData.property || existingItem.property
                    if (!newOrExistingPropertyId) return
                    const [property] = await Property.getAll(context, { id: newOrExistingPropertyId })
                    const newOrExistingAddress = resolvedData.address || existingItem.address
                    if (property.address !== newOrExistingAddress) {
                        return addFieldValidationError('Cannot connect property, because its address differs from address of resident')
                    }
                },
            },
        },

        contact: {
            schemaDoc: 'Contact will be associated, when it will get a verified billing account',
            type: Relationship,
            ref: 'Contact',
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },

        billingAccount: {
            schemaDoc: 'System-wide billing account, that will allow to pay for all services from all organizations',
            type: Relationship,
            ref: 'BillingAccount',
            kmigratorOptions: { null: true, on_delete: 'models.SET_NULL' },
        },

        address: {
            schemaDoc: 'Normalized address',
            type: Text,
            isRequired: true,
        },

        addressMeta: ADDRESS_META_FIELD,

        unitName: {
            schemaDoc: 'Unit of the property, in which this person resides',
            type: Text,
            isRequired: true,
        },

        name: {
            schemaDoc: 'Full name of resident person',
            type: Text,
            isRequired: true,
        },

        email: {
            schemaDoc: 'Contact email of resident person, can be specific to related property unit',
            type: Text,
            isRequired: false,
            hooks: {
                resolveInput: async ({ resolvedData }) => {
                    if (!resolvedData['email']) return resolvedData['email']
                    const newValue = normalizeEmail(resolvedData['email'])
                    return newValue || resolvedData['email']
                },
                validateInput: async ({ resolvedData, addFieldValidationError }) => {
                    const newValue = normalizeEmail(resolvedData['email'])
                    if (resolvedData['email'] && newValue !== resolvedData['email']) {
                        addFieldValidationError(`${EMAIL_WRONG_FORMAT_ERROR}email] invalid format`)
                    }
                },
            },
        },

        phone: {
            schemaDoc: 'Contact phone of resident person, can be specific to related property unit',
            type: Text,
            isRequired: true,
            hooks: {
                resolveInput: async ({ resolvedData }) => {
                    const newValue = normalizePhone(resolvedData['phone'])
                    return newValue || resolvedData['phone']
                },
                validateInput: async ({ resolvedData, addFieldValidationError }) => {
                    const newValue = normalizePhone(resolvedData['phone'])
                    if (resolvedData['phone'] && newValue !== resolvedData['phone']) {
                        addFieldValidationError(`${PHONE_WRONG_FORMAT_ERROR}phone] invalid format`)
                    }
                },
            },
        },

    },
    plugins: [uuided(), versioned(), tracked(), softDeleted(), historical()],
    hooks: {
        validateInput: async ({ resolvedData, operation, existingItem, addValidationError, context }) => {
            const { property, unitName, phone, contact, billingAccount } = resolvedData
            const [resident] = await ResidentAPI.getAll(context, {
                property: { id: property },
                unitName,
                phone,
            })
            if (contact) {
                const [residentWithSameContact] = await ResidentAPI.getAll(context, {
                    contact: { id: contact },
                })
                if (residentWithSameContact) {
                    return addValidationError('Specified contact is already connected with another resident')
                }
            }
            if (billingAccount) {
                const [residentWithSameBillingAccount] = await ResidentAPI.getAll(context, {
                    billingAccount: { id: billingAccount },
                })
                if (residentWithSameBillingAccount) {
                    return addValidationError('Specified billing account is already connected to another resident')
                }
            }
            if (operation === 'create') {
                if (resident) {
                    return addValidationError('Cannot create resident, because another resident with the same provided set of "property", "unitName", "phone"')
                }
            } else if (operation === 'update') {
                if (resident && resident.id !== existingItem.id) {
                    return addValidationError('Cannot update resident, because another resident already exists with the same provided set of "property", "unitName", "phone"')
                }
            }
        },
    },
    access: {
        read: access.canReadResidents,
        create: access.canManageResidents,
        update: access.canManageResidents,
        delete: false,
        auth: true,
    },
})

module.exports = {
    Resident,
}
