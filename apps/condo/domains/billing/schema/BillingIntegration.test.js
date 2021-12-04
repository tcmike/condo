/**
 * Generated by `createschema billing.BillingIntegration name:Text;`
 */
import { catchErrorFrom } from '@condo/domains/common/utils/testSchema'

const { getRandomString } = require('@core/keystone/test.utils')
const { makeClientWithNewRegisteredAndLoggedInUser, makeClientWithSupportUser } = require('@condo/domains/user/utils/testSchema')
const { makeLoggedInAdminClient, makeClient } = require('@core/keystone/test.utils')
const { BillingIntegration, createTestBillingIntegration, updateTestBillingIntegration } = require('@condo/domains/billing/utils/testSchema')
const { expectToThrowAuthenticationErrorToObjects, expectToThrowAccessDeniedErrorToObj, expectToThrowAuthenticationErrorToObj  } = require('@condo/domains/common/utils/testSchema')
const faker = require('faker')

describe('BillingIntegration', () => {

    describe('Validators', () => {
        test('update format with right payload', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)

            const payload = {
                dataFormat: {
                    hasToPayDetails: true,
                    hasServices: true,
                    hasServicesDetails: true,
                },
            }

            const [updatedIntegration] = await updateTestBillingIntegration(admin, objCreated.id, payload)

            expect(updatedIntegration.id).toEqual(objCreated.id)
            expect(updatedIntegration.dataFormat.hasToPayDetails).toEqual(true)
        })

        test('update format with wrong payload', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)

            const payload = {
                dataFormat: {
                    hasToPayDetails: true,
                    hasServices: true,
                    // no hasServiceDetail key!
                },
            }

            await catchErrorFrom(async () => {
                await updateTestBillingIntegration(admin, objCreated.id, payload)
            }, (err) => {
                expect(err).toBeDefined()
            })
        })

        test('Can be created with options', async () => {
            const support = await makeClientWithSupportUser()
            const firstOption = { name: '1C', billingPageTitle: 'Биллиг "Реестры 1C"', descriptionDetails: { urlText: 'о формате', url: faker.internet.url() } }
            const noDescriptionOption = { name: 'Сббол 9_2', billingPageTitle: 'Биллиг "Реестрыыыыыы"' }
            const dataFormatOverrideOption = {
                name: 'Сббол 8_1',
                descriptionDetails: { urlText: 'о формате', url: faker.internet.url() },
                dataFormat: {
                    hasToPayDetails: true,
                    hasServices: true,
                    hasServicesDetails: false,
                },
            }
            const title = 'Формат ваших реестров'
            const payload = {
                availableOptions: {
                    title,
                    options: [
                        firstOption,
                        noDescriptionOption,
                        dataFormatOverrideOption,
                    ],
                },
            }
            const [billing] = await createTestBillingIntegration(support, payload)
            expect(billing).toBeDefined()
            expect(billing).toHaveProperty(['availableOptions', 'title'], title)
            expect(billing).toHaveProperty(['availableOptions', 'options'])
            expect(billing.availableOptions.options).toEqual(expect.arrayContaining([
                expect.objectContaining(firstOption),
                expect.objectContaining(noDescriptionOption),
                expect.objectContaining(dataFormatOverrideOption),
            ]))
        })
    })

    describe('Create', async () => {
        test('admin can create BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [integration, attrs] = await createTestBillingIntegration(admin)
            expect(integration).toEqual(expect.objectContaining({
                name: attrs.name,
                detailsTitle: attrs.detailsTitle,
            }))
        })

        test('support can create BillingIntegration', async () => {
            const support = await makeClientWithSupportUser()
            const [integration, attrs] = await createTestBillingIntegration(support)
            expect(integration).toEqual(expect.objectContaining({
                name: attrs.name,
            }))
        })

        test('user cant create BillingIntegration', async () => {
            const client = await makeClientWithNewRegisteredAndLoggedInUser()
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await createTestBillingIntegration(client)
            })
        })

        test('anonymous cant create BillingIntegration', async () => {
            const client = await makeClient()
            await expectToThrowAuthenticationErrorToObj(async () => {
                await createTestBillingIntegration(client)
            })
        })
    })

    describe('Update', async () => {
        test('support can update BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)
            const support = await makeClientWithSupportUser()
            const payload = { name: 'super-billing!', currencyCode: 'EUR' }
            const [updatedIntegration] = await updateTestBillingIntegration(support, objCreated.id, payload)
            expect(updatedIntegration.id).toEqual(objCreated.id)
            expect(updatedIntegration.name).toEqual('super-billing!')
            expect(updatedIntegration.currencyCode).toBeDefined()
        })

        test('user cant update BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)

            const client = await makeClientWithNewRegisteredAndLoggedInUser()
            const payload = { name: getRandomString() }
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await updateTestBillingIntegration(client, objCreated.id, payload)
            })
        })

        test('anonymous cant update BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)

            const client = await makeClient()
            const payload = {}
            await expectToThrowAuthenticationErrorToObj(async () => {
                await updateTestBillingIntegration(client, objCreated.id, payload)
            })
        })
    })

    describe('Read', async () => {
        test('user can read BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [obj, attrs] = await createTestBillingIntegration(admin)

            const client = await makeClientWithNewRegisteredAndLoggedInUser()
            const objs = await BillingIntegration.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })

            expect(objs.length >= 1).toBeTruthy()
            expect(objs).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: obj.id,
                    sender: attrs.sender,
                    createdBy: expect.objectContaining({ id: admin.user.id }),
                    updatedBy: expect.objectContaining({ id: admin.user.id }),
                    createdAt: obj.createdAt,
                    updatedAt: obj.updatedAt,
                    name: attrs.name,
                }),
            ]))
        })

        test('anonymous cant read BillingIntegration', async () => {
            const client = await makeClient()

            await expectToThrowAuthenticationErrorToObjects(async () => {
                await BillingIntegration.getAll(client)
            })
        })
    })

    describe('Delete', async () => {
        test('user cant delete BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)

            const client = await makeClientWithNewRegisteredAndLoggedInUser()
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await BillingIntegration.delete(client, objCreated.id)
            })
        })

        test('anonymous cant delete BillingIntegration', async () => {
            const admin = await makeLoggedInAdminClient()
            const [objCreated] = await createTestBillingIntegration(admin)

            const client = await makeClient()
            await expectToThrowAccessDeniedErrorToObj(async () => {
                await BillingIntegration.delete(client, objCreated.id)
            })
        })
    })
})
