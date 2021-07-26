/**
 * Generated by `createservice onboarding.CreateOnBoardingService`
 */

const { GQLCustomSchema } = require('@core/keystone/schema')
const access = require('@condo/domains/onboarding/access/CreateOnBoardingService')
const { OnBoarding } = require('@condo/domains/onboarding/utils/serverSchema')
const { OnBoardingStep } = require('@condo/domains/onboarding/utils/serverSchema')
const { ONBOARDING_TYPES, ONBOARDING_STEPS } = require('../constants')
const { get } = require('lodash')

const CreateOnBoardingService = new GQLCustomSchema('CreateOnBoardingService', {
    types: [
        {
            access: true,
            type: `enum OnBoardingType { ${ONBOARDING_TYPES.join(' ')} }`,
        },
        {
            access: true,
            type: 'input CreateOnBoardingInput { dv: Int!, sender: JSON!, type: OnBoardingType, userId:ID! }',
        },
    ],

    mutations: [
        {
            access: access.canCreateOnBoarding,
            schema: 'createOnBoardingByType(data: CreateOnBoardingInput!): OnBoarding',
            resolver: async (parent, args, context) => {
                const { data } = args
                const { type, dv, sender, userId } = data

                if (!ONBOARDING_TYPES.includes(type)) {
                    throw new Error(`[error] Cannot create onboarding for ${type}. Unsupported role.`)
                }

                const onBoardingStepData = ONBOARDING_STEPS[type]

                if (!onBoardingStepData) {
                    throw new Error(`[error] Cannot create onboarding for ${type}. StepTransitions is not defined.`)
                }

                const onBoarding = await OnBoarding.create(context, {
                    dv,
                    type,
                    sender,
                    stepsTransitions: onBoardingStepData.transitions,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                })

                for (let i = 0; i < onBoardingStepData.steps.length; i++) {
                    const currentStep = onBoardingStepData.steps[i]

                    await OnBoardingStep.create(context, {
                        dv,
                        sender,
                        ...currentStep,
                        onBoarding: { connect: { id: onBoarding.id } },
                    })
                }

                return {
                    id: onBoarding.id,
                }
            },
        },
    ],

})

module.exports = {
    CreateOnBoardingService,
}
