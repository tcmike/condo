/**
 * Generated by `createschema notification.PushToken PushToken`
 */

const { makeLoggedInAdminClient, makeClient, UUID_RE, DATETIME_RE, makeLoggedInClient } = require('@core/keystone/test.utils')

const { PushToken, createTestPushToken, updateTestPushToken } = require('@condo/domains/notification/utils/testSchema')
const { expectToThrowAccessDeniedErrorToObjects, expectToThrowAuthenticationErrorToObjects } = require('@condo/domains/common/utils/testSchema')

/**
 * 1. Push Notification token registration
 *  1.1. unauthorized (anonymous) user provides deviceId, token, serviceType (userId is unknown, will not be connected on create)
 *  1.2. authorized (logged in) user provides deviceId, token, serviceType (userId is known, will be connected on create)
 * 2. Connecting deviceId to userId (only authorized users)
 * 3. Disconnecting deviceId from userId
 *  3.1. authorized (logged in) user disconnects userId (userId is received from current authorization data) from deviceId (logout?)
 *  3.2. unauthorized (anonymous) user disconnects userId (current connected userId to provided deviceId is not required for this operation) from deviceId (re-login or other user login?)
 */

describe('PushToken', () => {
    test('user: create PushToken', async () => {
        const client = await makeLoggedInClient()
        const [obj, attrs] = await createTestPushToken(client)

        expect(obj.id).toMatch(UUID_RE)
        expect(obj.dv).toEqual(1)
        expect(obj.sender).toEqual(attrs.sender)
        expect(obj.v).toEqual(1)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
    })

    test('anonymous: create PushToken', async () => {
        const client = await makeClient()
        const [obj, attrs] = await createTestPushToken(client)

        expect(obj.id).toMatch(UUID_RE)
        expect(obj.dv).toEqual(1)
        expect(obj.sender).toEqual(attrs.sender)
        expect(obj.v).toEqual(1)
        expect(obj.newId).toEqual(null)
        expect(obj.deletedAt).toEqual(null)
        expect(obj.createdAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
    })

    test('user: read other`s PushToken', async () => {
        const admin = await makeLoggedInAdminClient()
        const [obj, attrs] = await createTestPushToken(admin)

        const client = await makeClient()

        await expectToThrowAuthenticationErrorToObjects(async () => {
            await PushToken.getAll(client)
        })
    })

    test('user: read own PushToken', async () => {
        const admin = await makeLoggedInAdminClient()
        const [obj, attrs] = await createTestPushToken(admin)

        const client = await makeClient()
        const objs = await PushToken.getAll(client, {}, { sortBy: ['updatedAt_DESC'] })


        console.log('objs:', objs)

        expect(objs).toHaveLength(1)
        // expect(objs.length >= 1).toBeTruthy()
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

    test('anonymous: read PushToken', async () => {
        const client = await makeClient()

        await expectToThrowAuthenticationErrorToObjects(async () => {
            await PushToken.getAll(client)
        })
    })

    test('user: update PushToken', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestPushToken(admin)  // TODO(codegen): check create function!

        const client = await makeClient()  // TODO(codegen): use truly useful client!
        const payload = {}  // TODO(codegen): change the 'user: update PushToken' payload
        const [objUpdated, attrs] = await updateTestPushToken(client, objCreated.id, payload)

        // TODO(codegen): white checks for 'user: update PushToken' test
        expect(objUpdated.id).toEqual(objCreated.id)
        expect(objUpdated.dv).toEqual(1)
        expect(objUpdated.sender).toEqual(attrs.sender)
        expect(objUpdated.v).toEqual(2)
        expect(objUpdated.newId).toEqual(null)
        expect(objUpdated.deletedAt).toEqual(null)
        expect(objUpdated.createdBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(objUpdated.updatedBy).toEqual(expect.objectContaining({ id: client.user.id }))
        expect(objUpdated.createdAt).toMatch(DATETIME_RE)
        expect(objUpdated.updatedAt).toMatch(DATETIME_RE)
        expect(objUpdated.updatedAt).not.toEqual(objUpdated.createdAt)
    })

    test('anonymous: update PushToken', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestPushToken(admin)  // TODO(codegen): check create function!

        const client = await makeClient()
        const payload = {}  // TODO(codegen): change the 'anonymous: update PushToken' payload
        await expectToThrowAuthenticationErrorToObjects(async () => {
            await updateTestPushToken(client, objCreated.id, payload)
        })
    })

    test('user: delete PushToken', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestPushToken(admin)  // TODO(codegen): check create function!

        const client = await makeClient()  // TODO(codegen): use truly useful client!
        try {
            // TODO(codegen): check 'user: delete PushToken' test!
            await PushToken.delete(client, objCreated.id)
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['obj'],
            })
            expect(e.data).toEqual({ 'obj': null })
        }
    })

    test('anonymous: delete PushToken', async () => {
        const admin = await makeLoggedInAdminClient()
        const [objCreated] = await createTestPushToken(admin)  // TODO(codegen): check create function!

        const client = await makeClient()
        try {
            // TODO(codegen): check 'anonymous: delete PushToken' test!
            await PushToken.delete(client, objCreated.id)
        } catch (e) {
            expect(e.errors[0]).toMatchObject({
                'message': 'You do not have access to this resource',
                'name': 'AccessDeniedError',
                'path': ['obj'],
            })
            expect(e.data).toEqual({ 'obj': null })
        }
    })
})
