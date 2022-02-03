/**
 * Generated by `createschema user.User name:Text; password?:Password; isAdmin?:Checkbox; email?:Text; isEmailVerified?:Checkbox; phone?:Text; isPhoneVerified?:Checkbox; avatar?:File; meta:Json; importId:Text;`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { gql } = require('graphql-tag')

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt newId createdBy { id name } updatedBy { id name } createdAt updatedAt'

const USER_FIELDS = `{ name avatar { publicUrl } meta type isPhoneVerified isEmailVerified importId importRemoteSystem ${COMMON_FIELDS} }`
const User = generateGqlQueries('User', USER_FIELDS)
const UserAdmin = generateGqlQueries('User', '{ id isAdmin isSupport email isEmailVerified phone isPhoneVerified }')

const REGISTER_NEW_USER_MUTATION = gql`
    mutation registerNewUser($data: RegisterNewUserInput!) {
        user: registerNewUser(data: $data) ${USER_FIELDS}
    }
`

const GET_MY_USERINFO = gql`
    query getUser {
        user: authenticatedUser ${USER_FIELDS}
    }
`

const SIGNIN_MUTATION = gql`
    mutation sigin($identity: String, $secret: String) {
        auth: authenticateUserWithPassword(email: $identity, password: $secret) {
            user: item ${USER_FIELDS}
        }
    }
`

const CHANGE_PASSWORD_WITH_TOKEN_MUTATION = gql`
    mutation changePasswordWithToken($data: ChangePasswordWithTokenInput!) {
        result: changePasswordWithToken(data: $data) { status, phone }
    }
`

const SIGNIN_BY_PHONE_AND_PASSWORD_MUTATION = gql`
    mutation authenticateUserWithPhoneAndPassword ($phone: String!, $password: String!) {
        obj: authenticateUserWithPhoneAndPassword(data: { phone: $phone, password: $password }) {
            item {
                id
            }
        }
    }
`
const START_PASSWORD_RECOVERY_MUTATION = gql`
    mutation startPasswordRecovery($data: StartPasswordRecoveryInput!) {
        result: startPasswordRecovery(data: $data) { status }
    }
`


const CHECK_PASSWORD_RECOVERY_TOKEN = gql`
    query checkPasswordRecoveryToken($data: CheckPasswordRecoveryTokenInput!) {
        result: checkPasswordRecoveryToken(data: $data) { status }
    }
`


const START_CONFIRM_PHONE_MUTATION = gql`
    mutation startConfirmPhoneAction($data: StartConfirmPhoneActionInput!) {
        result: startConfirmPhoneAction(data: $data) { token }
    }
`
const RESEND_CONFIRM_PHONE_SMS_MUTATION = gql`
    mutation resendConfirmPhoneActionSms($data: ResendConfirmPhoneActionSmsInput!) {
        result: resendConfirmPhoneActionSms(data: $data) { status }
    }
`
const COMPLETE_CONFIRM_PHONE_MUTATION = gql`
    mutation completeConfirmPhoneAction($data: CompleteConfirmPhoneActionInput!) {
        result: completeConfirmPhoneAction(data: $data) { status }
    }
`
const GET_PHONE_BY_CONFIRM_PHONE_TOKEN_QUERY = gql`
    query getPhoneByConfirmPhoneActionToken($data: GetPhoneByConfirmPhoneActionTokenInput!) {
        result: getPhoneByConfirmPhoneActionToken(data: $data) { phone, isPhoneVerified }
    }
`

const CONFIRM_PHONE_ACTION_FIELDS = '{ id dv sender { dv fingerprint } deletedAt phone token smsCode smsCodeRequestedAt smsCodeExpiresAt retries isPhoneVerified requestedAt expiresAt completedAt }'
const ConfirmPhoneAction = generateGqlQueries('ConfirmPhoneAction', CONFIRM_PHONE_ACTION_FIELDS)
const FORGOT_PASSWORD_ACTION_FIELDS = `{ user { id } token requestedAt expiresAt usedAt ${COMMON_FIELDS} }`
const ForgotPasswordAction = generateGqlQueries('ForgotPasswordAction', FORGOT_PASSWORD_ACTION_FIELDS)


// TODO(codegen): write return type result!
const SIGNIN_RESIDENT_USER_MUTATION = gql`
    mutation signinResidentUser ($data: SigninResidentUserInput!) {
        result: signinResidentUser(data: $data) { user { id name }, token }
    }
`
// TODO(codegen): write return type result!
const CHANGE_PHONE_NUMBER_RESIDENT_USER_MUTATION = gql`
    mutation changePhoneNumberResidentUser ($data: ChangePhoneNumberResidentUserInput!) {
        result: changePhoneNumberResidentUser(data: $data) { status }
    }
`
const SIGNIN_AS_USER_MUTATION = gql`
    mutation signinAsUser ($data: SigninAsUserInput!) {
        result: signinAsUser(data: $data) { user { id } token }
    }
`


const REGISTER_NEW_SERVICE_USER_MUTATION = gql`
    mutation registerNewServiceUser ($data: RegisterNewServiceUserInput!) {
        result: registerNewServiceUser(data: $data) ${USER_FIELDS}
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    User,
    UserAdmin,
    REGISTER_NEW_USER_MUTATION,
    GET_MY_USERINFO,
    SIGNIN_MUTATION,
    CHANGE_PASSWORD_WITH_TOKEN_MUTATION,
    SIGNIN_BY_PHONE_AND_PASSWORD_MUTATION,
    START_PASSWORD_RECOVERY_MUTATION,
    START_CONFIRM_PHONE_MUTATION,
    RESEND_CONFIRM_PHONE_SMS_MUTATION,
    COMPLETE_CONFIRM_PHONE_MUTATION,
    GET_PHONE_BY_CONFIRM_PHONE_TOKEN_QUERY,
    ConfirmPhoneAction,
    ForgotPasswordAction,
    CHECK_PASSWORD_RECOVERY_TOKEN,
    SIGNIN_RESIDENT_USER_MUTATION,
    CHANGE_PHONE_NUMBER_RESIDENT_USER_MUTATION,
    SIGNIN_AS_USER_MUTATION,
    REGISTER_NEW_SERVICE_USER_MUTATION,

/* AUTOGENERATE MARKER <EXPORTS> */
}
