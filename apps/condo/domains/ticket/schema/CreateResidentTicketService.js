/**
 * Generated by `createservice ticket.CreateResidentTicketService --type mutations`
 */
const { Contact } = require('@condo/domains/contact/utils/serverSchema')
const { Property } = require('@condo/domains/property/utils/serverSchema')
const { Ticket, TicketSource } = require('../utils/serverSchema')
const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/ticket/access/CreateResidentTicketService')
const { NOT_FOUND_ERROR } = require('@condo/domains/common/constants/errors')
const { getSectionAndFloorByUnitName } = require('@condo/domains/ticket/utils/unit')
const { get } = require('lodash')

const CreateResidentTicketService = new GQLCustomSchema('CreateResidentTicketService', {
    types: [
        {
            access: true,
            type: 'input ResidentTicketCreateInput { dv: Int!, sender: JSON!, details: String!, source: TicketSourceRelateToOneInput!, property: PropertyRelateToOneInput!, unitName: String }',
        },
        {
            access: true,
            type:
                'type ResidentTicketOutput { organization: Organization!, property: Property!, unitName: String,' +
                'sectionName: String, floorName: String, number: Int!, client: User, clientName: String,' +
                'clientEmail: String, clientPhone: String, details: String!, related: Ticket, isEmergency: Boolean, status: TicketStatus!' +
                'isPaid: Boolean, source: TicketSource!, id: ID!, createdAt: String!, updatedAt: String, placeClassifier: TicketPlaceClassifier,' +
                'categoryClassifier: TicketCategoryClassifier, dv: Int, sender: JSON, v: Int, deletedAt: String, newId: String }',
        },
    ],

    mutations: [
        {
            access: access.canCreateResidentTicket,
            schema: 'createResidentTicket(data: ResidentTicketCreateInput): ResidentTicketOutput',
            resolver: async (parent, args, context, info, extra = {}) => {
                const { data } = args
                const { dv: newTicketDv, sender: newTicketSender, details, source: SourceRelateToOneInput, property: PropertyRelateToOneInput, unitName } = data

                const { connect: { id: propertyId } } = PropertyRelateToOneInput
                const [property] = await Property.getAll(context, { id: propertyId })
                if (!property) throw Error(`${NOT_FOUND_ERROR}property] property not found`)

                const { connect: { id: sourceId } } = SourceRelateToOneInput
                const [source] = await TicketSource.getAll(context, { id: sourceId })
                if (!source) throw Error(`${NOT_FOUND_ERROR}source] source not found`)

                const organizationId = get(property, ['organization', 'id'])
                const { sectionName, floorName } = getSectionAndFloorByUnitName(property, unitName)
                if (unitName && (!sectionName || !floorName)) throw Error(`${NOT_FOUND_ERROR}unitName] unitName not found`)

                const user = get(context, ['req', 'user'])

                const [contact] = await Contact.getAll(context, {
                    phone: user.phone, organization: { id: organizationId }, property: { id: propertyId },
                })
                if (!contact) {
                    await Contact.create(context, {
                        dv: newTicketDv,
                        sender: newTicketSender,
                        organization: { connect: { id: organizationId } },
                        property: PropertyRelateToOneInput,
                        unitName,
                        email: user.email,
                        phone: user.phone,
                        name: user.name,
                    })
                }

                return await Ticket.create(context, {
                    dv: newTicketDv,
                    sender: newTicketSender,
                    organization: { connect: { id: organizationId } },
                    client: { connect: { id: user.id } },
                    property: PropertyRelateToOneInput,
                    unitName,
                    sectionName,
                    floorName,
                    source: SourceRelateToOneInput,
                    details,
                })
            },
        },
    ],
})

module.exports = {
    CreateResidentTicketService,
}