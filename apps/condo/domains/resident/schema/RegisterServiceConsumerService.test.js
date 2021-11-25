/**
 * Generated by `createservice resident.RegisterServiceConsumerService --type mutations`
 */
const faker = require('faker')

const { makeClient } = require('@core/keystone/test.utils')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')

const { catchErrorFrom, expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj } = require('@condo/domains/common/utils/testSchema')
const { updateTestUser } = require('@condo/domains/user/utils/testSchema')
const { RESIDENT } = require('@condo/domains/user/constants/common')
const { COLD_WATER_METER_RESOURCE_ID } = require('@condo/domains/meter/constants/constants')
const { MeterResource, createTestMeter } = require('@condo/domains/meter/utils/testSchema')
const { createTestOrganization } = require('@condo/domains/organization/utils/testSchema')
const { makeClientWithProperty } = require('@condo/domains/property/utils/testSchema')
const { createTestBillingProperty, createTestBillingAccount, createTestBillingIntegration, createTestBillingIntegrationOrganizationContext } = require('@condo/domains/billing/utils/testSchema')
const { registerServiceConsumerByTestClient, updateTestServiceConsumer, createTestResident } = require('@condo/domains/resident/utils/testSchema')
 
describe('RegisterServiceConsumerService', () => {

    it('does not create same service consumer twice', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }

        const out = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).not.toEqual(undefined)

        const out2 = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out2.id).toEqual(out.id)
    })

    it('can create, delete and create service consumer', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }
        const [out] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).not.toEqual(undefined)

        await updateTestServiceConsumer(userClient, out.id, { deletedAt: 'true' })

        const [out2] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out2.id).toEqual(out.id)
    })

    it('creates serviceConsumer with billingAccount for separate organization', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [organization] = await createTestOrganization(adminClient)
        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, undefined, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: organization.id,
        }

        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).toBeDefined()
        expect(out.billingAccount).toBeDefined()
    })

    it('creates serviceConsumer with billingAccount and Meters', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const USER_UNIT_NAME = String(faker.random.number())
        const USER_ACCOUNT_NUMBER = String(faker.random.number())

        const [integration] = await createTestBillingIntegration(adminClient)
        const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })

        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty, {
            number: USER_ACCOUNT_NUMBER,
            unitName: USER_UNIT_NAME,
        })

        await createTestMeter(adminClient, userClient.organization, userClient.property, resource, {
            unitName: USER_UNIT_NAME,
            accountNumber: USER_ACCOUNT_NUMBER,
        })
        await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: USER_UNIT_NAME,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: USER_ACCOUNT_NUMBER,
            organizationId: userClient.organization.id,
        }
        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)

        expect(out).toBeDefined()
        expect(out.billingAccount.id).toEqual(billingAccountAttrs.id)
    })

    it('creates serviceConsumer with billingAccount without Meters', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: billingAccountAttrs.number,
            organizationId: userClient.organization.id,
        }
        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)

        expect(out).toBeDefined()
        expect(out.billingAccount.id).toEqual(billingAccountAttrs.id)
    })

    it('creates serviceConsumer without billingAccount when Meters are found', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [resource] = await MeterResource.getAll(adminClient, { id: COLD_WATER_METER_RESOURCE_ID })
        const [integration] = await createTestBillingIntegration(adminClient)

        const USER_UNIT_NAME = String(faker.random.number())
        const USER_ACCOUNT_NUMBER = String(faker.random.number())

        await createTestMeter(adminClient, userClient.organization, userClient.property, resource, {
            unitName: USER_UNIT_NAME,
            accountNumber: USER_ACCOUNT_NUMBER,
        })
        await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, undefined, userClient.property, {
            unitName: USER_UNIT_NAME,
        })

        const payload = {
            residentId: resident.id,
            accountNumber: USER_ACCOUNT_NUMBER,
            organizationId: userClient.organization.id,
        }

        const [ out ] = await registerServiceConsumerByTestClient(userClient, payload)
        expect(out).toBeDefined()
        expect(out.billingAccount).toBeNull()
    })

    it('fails with error when billingAccount not found, and Meters are not found', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, undefined, userClient.property, {
            unitName: '21',
        })

        const payload = {
            residentId: resident.id,
            accountNumber: '221231232',
            organizationId: userClient.organization.id,
        }

        await catchErrorFrom(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        }, (e) => {
            expect(e.errors[0].message).toContain('billingAccount')
        })
    })

    it('fails with error when creating serviceConsumer for nullish data', async () => {

        const userClient = await makeClientWithProperty()
        const adminClient = await makeLoggedInAdminClient()

        const [integration] = await createTestBillingIntegration(adminClient)
        const [context] = await createTestBillingIntegrationOrganizationContext(adminClient, userClient.organization, integration)
        const [billingProperty] = await createTestBillingProperty(adminClient, context)
        const [billingAccountAttrs] = await createTestBillingAccount(adminClient, context, billingProperty)

        await updateTestUser(adminClient, userClient.user.id, { type: RESIDENT })
        const [resident] = await createTestResident(adminClient, userClient.user, userClient.organization, userClient.property, {
            unitName: billingAccountAttrs.unitName,
        })

        const payloadWithNullishAccountName = {
            residentId: resident.id,
            accountNumber: '',
            organizationId: userClient.organization.id,
        }

        await catchErrorFrom(async () => {
            await registerServiceConsumerByTestClient(userClient, payloadWithNullishAccountName)
        }, (e) => {
            expect(e.errors[0].message).toContain('Account number null or empty')
        })
    })

    it('cannot be invoked by non-resident user', async () => {

        const userClient = await makeClientWithProperty()

        const payload = {
            residentId: 'test-id',
            accountNumber: 'test-number',
            organizationId: userClient.organization.id,
        }

        await expectToThrowAccessDeniedErrorToObj(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        })
    })

    it('cannot be invoked by anonymous', async () => {

        const userClient = await makeClient()
        const userClient2 = await makeClientWithProperty()

        const payload = {
            residentId: 'test-id',
            accountNumber: 'test-number',
            organizationId: userClient2.organization.id,
        }

        await expectToThrowAuthenticationErrorToObj(async () => {
            await registerServiceConsumerByTestClient(userClient, payload)
        })
    })
})