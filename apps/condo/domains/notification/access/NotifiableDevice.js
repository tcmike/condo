// @ts-nocheck
/**
 * Generated by `createschema notification.NotifiableDevice 'deviceId:Text; token?:Text; serviceType?:Select:firebase,apple,huawei; owner?:Relationship:User:SET_NULL; meta?:Json'`
 */

const { throwAuthenticationError } = require('@condo/domains/common/utils/apolloErrorFormatter')

/**
 * Manages native readability of schema. Is readable by admin and and authorized owner user.
 * @param user
 * @returns {Promise<{}|boolean|{owner: {id}}>}
 */
async function canReadNotifiableDevices ({ authentication: { item: user } }) {
    if (!user) return throwAuthenticationError()
    if (user.deletedAt) return false
    if (user.isAdmin) return {}

    // User allowed to read own device info
    return { owner: { id: user.id } }}

/**
 * Manages create/update/delete access rights. Natively available only for admin users.
 * All other cases are managed within SyncNotifiableDeviceService and DisconnectNotifiableDeviceFromUserService
 * @param user
 * @returns {Promise<boolean>}
 */
async function canManageNotifiableDevices ({ authentication: { item: user } }) {
    if (user && user.isAdmin) return true

    return false
}

/*
  Rules are logical functions that used for list access, and may return a boolean (meaning
  all or no items are available) or a set of filters that limit the available items.
*/
module.exports = {
    canReadNotifiableDevices,
    canManageNotifiableDevices,
}