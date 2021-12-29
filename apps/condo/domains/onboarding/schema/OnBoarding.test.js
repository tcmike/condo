/**
 * Generated by `createschema onboarding.OnBoarding 'completed:Checkbox; stepsTransitions:Json;'`
 */

const { makeLoggedInAdminClient, makeLoggedInClient, makeClient, UUID_RE, DATETIME_RE } = require('@core/keystone/test.utils')

const { OnBoarding, createTestOnBoarding, updateTestOnBoarding } = require('@condo/domains/onboarding/utils/testSchema')
const { expectToThrowAuthenticationErrorToObj, expectToThrowAuthenticationErrorToObjects } = require('@condo/domains/common/utils/testSchema')

describe('OnBoarding', () => {
    test('user: create OnBoarding', async () => {
        const client = await makeLoggedInClient()

        const [obj, attrs] = await createTestOnBoarding(
            client,
            {
                type: 'ADMINISTRATOR',
                user: { connect: { id: client.user.id } },
                stepsTransitions: {},
            }
        )
        expect(obj.id).toMatch(UUID_RE)
        expect(obj.dv).toEqual(1)
        expect(obj.sender).toEqual(attrs.sender)
        expect(obj.v).toEqual(1)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
    })

    test('anonymous: create OnBoarding', async () => {
        const client = await makeClient()
        await expectToThrowAuthenticationErrorToObj(async () => {
            await createTestOnBoarding(client)
        })
    })

    test('user: read OnBoarding', async () => {
        const admin = await makeLoggedInAdminClient()
        const [obj, attrs] = await createTestOnBoarding(admin, {
            type: 'ADMINISTRATOR',
            user: { connect: { id: admin.user.id } },
            stepsTransitions: {},
        })

        const client = await makeLoggedInClient()
        const objs = await OnBoarding.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })

        expect(objs.length >= 1).toBeTruthy()
        expect(objs[0].id).toMatch(obj.id)
        expect(objs[0].dv).toEqual(1)
        expect(objs[0].sender).toEqual(attrs.sender)
        expect(objs[0].v).toEqual(1)
        expect(objs[0].newId).toEqual(null)
        expect(objs[0].deletedAt).toEqual(null)
        expect(objs[0].createdBy).toEqual(expect.objectContaining({ id: admin.user.id }))
        expect(objs[0].updatedBy).toEqual(expect.objectContaining({ id: admin.user.id }))
        expect(objs[0].createdAt).toMatch(obj.createdAt)
        expect(objs[0].updatedAt).toMatch(obj.updatedAt)
    })

    test('anonymous: read OnBoarding', async () => {
        const client = await makeClient()

        await expectToThrowAuthenticationErrorToObjects(async () => {
            await OnBoarding.getAll(client)
        })
    })

    test('user: update OnBoarding', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestOnBoarding(admin, {
            type: 'ADMINISTRATOR',
            user: { connect: { id: admin.user.id } },
            stepsTransitions: {},
        })

        const payload = { completed: true }
        const [objUpdated, attrs] = await updateTestOnBoarding(admin, objCreated.id, payload)

        expect(objUpdated.id).toEqual(objCreated.id)
        expect(objUpdated.dv).toEqual(1)
        expect(objUpdated.sender).toEqual(attrs.sender)
        expect(objUpdated.v).toEqual(2)
        expect(objUpdated.newId).toEqual(null)
        expect(objUpdated.completed).toEqual(true)
        expect(objUpdated.deletedAt).toEqual(null)
        expect(objUpdated.createdBy).toEqual(expect.objectContaining({ id: admin.user.id }))
        expect(objUpdated.updatedBy).toEqual(expect.objectContaining({ id: admin.user.id }))
        expect(objUpdated.createdAt).toMatch(DATETIME_RE)
        expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
        expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
    })
})
