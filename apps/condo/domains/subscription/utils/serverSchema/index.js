/**
 * Generated by `createschema subscription.ServiceSubscription 'type:Select:default,sbbol; isTrial:Checkbox; organization:Relationship:Organization:CASCADE; startAt:DateTimeUtc; finishAt:DateTimeUtc;'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateServerUtils, execGqlWithoutAccess } = require('@condo/domains/common/utils/codegeneration/generate.server.utils')

const { ServiceSubscription: ServiceSubscriptionGQL } = require('@condo/domains/subscription/gql')
/* AUTOGENERATE MARKER <IMPORT> */

const ServiceSubscription = generateServerUtils(ServiceSubscriptionGQL)
/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    ServiceSubscription,
/* AUTOGENERATE MARKER <EXPORTS> */
}