const { Property } = require('@condo/domains/property/utils/serverSchema')
const { Contact } = require('@condo/domains/contact/utils/serverSchema')
const { Organization } = require('@condo/domains/organization/utils/serverSchema')
const { User } = require('@condo/domains/user/utils/serverSchema')
const faker = require('faker')
const path = require('path')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { demoProperties } = require('./constants')

class ContactGenerator {

    property = null
    organization = null
    user = null
    contactsByProperty = {}
    context = null

    constructor ({ contactsByProperty = { min: 1000, max: 5 } }, placeToAdd = { user: null, organization: null }) {
        this.contactsByProperty = contactsByProperty
        this.userId = placeToAdd.user
        this.organizationId = placeToAdd.organization
    }

    async connect () {
        const resolved = path.resolve('./index.js')
        const { distDir, keystone, apps } = require(resolved)
        const graphqlIndex = apps.findIndex(app => app instanceof GraphQLApp)
        // we need only apollo
        await keystone.prepare({ apps: [apps[graphqlIndex]], distDir, dev: true })
        await keystone.connect()
        this.context = await keystone.createContext({ skipAccessControl: true })
    }

    async generate (propertyInfo) {
        await this.prepareModels(propertyInfo)
        await this.generateContacts()
    }

    async generateContacts () {
        let contactsToCreateCount = faker.datatype.number(this.contactsByProperty)
        let counter = 0
        for (const _ of new Array(contactsToCreateCount)) {
            const { unit } = this.unit
            await this.generateContact(unit)
            console.log(counter++)
        }
    }

    async generateContact (unitName) {
        const data = {
            dv: 1,
            sender: { dv: 1, fingerprint: 'import' },
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber('+7922#######'),
            unitName,
            organization: { connect: { id: this.organization.id } },
            property:  { connect: { id: this.property.id } },
        }
        await Contact.create(this.context, data)
    }

    async prepareModels (propertyInfo) {
        const [organization] = await Organization.getAll(this.context, { ...this.organizationId ? { id: this.organizationId } : {} })
        this.organization = organization
        if (!this.organization) {
            throw new Error('Please create user with organization first')
        }
        const [property] = await Property.getAll(this.context, { address: propertyInfo.address, organization: { id: this.organization.id } })
        if (!property){
            throw new Error('Property do not exists [SKIP!]')
        }
        this.property = property
    }

    get unit () {
        const result = { section: null, floor: null, unit: null }
        const section = this.property.map.sections[faker.datatype.number({ min: 0, max: this.property.map.sections.length - 1 })]
        result.section = section.name
        const floor = section.floors[faker.datatype.number({ min: 0, max: section.floors.length - 1 })]
        result.floor = floor.name
        const unit = floor.units[faker.datatype.number({ min: 0, max: floor.units.length - 1 })]
        result.unit = unit.label
        return result
    }

}

const createContracts = async () => {

    const ContactManager = new ContactGenerator({ contactsByProperty: { min: 1000, max: 5000 } }, {
        user: '',
        organization: '',
    })
    console.time('keystone')
    await ContactManager.connect()
    console.timeEnd('keystone')
    for (const info of demoProperties) {
        try {
            console.log(`[START] ${info.address}`)
            await ContactManager.generate(info)
            console.log(`[END] ${info.address}`)
        } catch (error) {
            console.log('error', error)
            console.log(`[SKIP] ${info.address}`)
        }
    }
}

if (process.env.NODE_ENV !== 'development') {
    console.log('NODE_ENV needs to be set to "development"')
    process.exit(1)
}

createContracts().then(() => {
    console.log('All done')
    process.exit(0)
}).catch(err => {
    console.error('Failed to done', err)
})
