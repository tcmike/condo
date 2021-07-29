import { AuthRequired } from '@condo/domains/common/components/containers/AuthRequired'
import { Col, Row, Skeleton, Space, Typography } from 'antd'
import Head from 'next/head'
import Router from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { PageContent, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { HouseIcon } from '@condo/domains/common/components/icons/HouseIcon'
import { UserIcon } from '@condo/domains/common/components/icons/UserIcon'
import { OnBoardingStepItem, OnBoardingStepType } from '@condo/domains/onboarding/components/OnBoardingStepItem'
import { OnBoarding, OnBoardingStep } from '@condo/domains/onboarding/utils/clientSchema'
import { CheckOutlined, WechatFilled, ProfileFilled, CreditCardFilled, BankOutlined } from '@ant-design/icons'
import get from 'lodash/get'
import { useIntl } from '@core/next/intl'
import { useAuth } from '@core/next/auth'
import LoadingOrErrorPage from '../domains/common/components/containers/LoadingOrErrorPage'
import { useCreateOrganizationModalForm } from '../domains/organization/hooks/useCreateOrganizationModalForm'
import { IPageInterface } from '../next-env'
import { OnBoardingStep as OnBoardingStepInterface  } from '../schema'

const getStepKey = (step: OnBoardingStepInterface) => `${step.action}.${step.entity}`

const getParentStep = (stepTransitions: Record<string, Array<string>>, stepKey: string, steps: Array<OnBoardingStepInterface>) => {
    let parentKey: string | undefined

    Object.keys(stepTransitions).map((key) => {
        if (!parentKey && stepTransitions[key].includes(stepKey)) {
            parentKey = key
        }
    })

    if (!parentKey) {
        return null
    }

    const [targetAction, targetEntity] = parentKey.split('.')

    return steps.find((step) => (
        step.action === targetAction && step.entity === targetEntity
    ))
}

const getStepType = (
    step: OnBoardingStepInterface,
    stepsTransitions: Record<string, Array<string>>,
    steps: Array<OnBoardingStepInterface>,
) => {
    const stepKey = getStepKey(step)
    const stepTransitions = get(stepsTransitions, stepKey)
    const parentStep = getParentStep(stepsTransitions, stepKey, steps)

    const parentRequired = get(parentStep, 'required')
    const parentCompleted = get(parentStep, 'completed')

    if (Array.isArray(stepTransitions)) {
        if (parentRequired && !parentCompleted) {
            return OnBoardingStepType.DISABLED
        }

        if (step.completed) {
            return OnBoardingStepType.COMPLETED
        }

        return OnBoardingStepType.DEFAULT
    } else {
        return OnBoardingStepType.DISABLED
    }
}

const OnBoardingPage: IPageInterface = () => {
    const intl = useIntl()
    const Title = intl.formatMessage({ id: 'onboarding.title' })
    const SubTitle = intl.formatMessage({ id: 'onboarding.subtitle' })
    const ServerErrorMessage = intl.formatMessage({ id: 'ServerError' })

    const { user } = useAuth()

    const { loading: onBordingLoading, obj: onBoarding, error: onBoardingError } = OnBoarding
        .useObject({ where: { user: { id: get(user, 'id') } } })

    const { loading: stepsLoading, objs: steps, error: stepsError } = OnBoardingStep
        .useObjects({ where: { onBoarding: { id: get(onBoarding, 'id') } } }, {
            fetchPolicy: 'network-only',
        })

    const { setVisible: showCreateOrganizationModal, ModalForm } = useCreateOrganizationModalForm()

    const onBoardingIconsMap = {
        organization: BankOutlined,
        house: HouseIcon,
        user: UserIcon,
        chat: WechatFilled,
        billing: ProfileFilled,
        creditCard: CreditCardFilled,
    }

    const onBoardingActionMap = useMemo(() => {
        return {
            'create.Organization': () => showCreateOrganizationModal(true),
            'create.Property': () => Router.push('property/create'),
            'create.OrganizationEmployee': () => Router.push('employee/create'),
        }
    }, [])

    useEffect(() => {
        const isOnBoardingCompleted = get(onBoarding, 'completed')

        if (isOnBoardingCompleted) {
            Router.push('/')
        }
    }, [onBoarding])

    const onBoardingSteps = useMemo(() => {
        if (onBoarding && Array.isArray(steps) && steps.length > 0) {
            return steps
                .sort((leftStep, rightStep) => leftStep.order > rightStep.order ? 1 : -1)
                .map((step) => {
                    const { title, description, icon } = step
                    const stepKey = getStepKey(step)

                    return (
                        <OnBoardingStepItem
                            action={step.completed ? null : onBoardingActionMap[stepKey]}
                            key={title}
                            title={title}
                            description={description}
                            icon={step.completed ? CheckOutlined : onBoardingIconsMap[icon]}
                            type={getStepType(step, get(onBoarding, 'stepsTransitions'), steps)}
                        />
                    )
                })
        }

        return []
    }, [steps, onBoarding])

    if (onBoardingError || stepsError) {
        return (
            <LoadingOrErrorPage title={Title} error={ServerErrorMessage}/>
        )
    }

    return (
        <>
            <Head>
                <title>{Title}</title>
            </Head>
            <PageWrapper>
                <AuthRequired>
                    <PageContent>
                        <Row gutter={[0, 40]}>
                            <Col span={24}>
                                <Space direction={'vertical'} size={24}>
                                    <Typography.Title level={1} style={{ margin: 0 }}>С чего начать?</Typography.Title>
                                    <Typography.Paragraph>{SubTitle}</Typography.Paragraph>
                                </Space>
                            </Col>
                            <Col span={24}>
                                {onBordingLoading || stepsLoading
                                    ? (
                                        <React.Fragment>
                                            <Skeleton active/>
                                            <Skeleton active/>
                                            <Skeleton active/>
                                            <Skeleton active/>
                                        </React.Fragment>
                                    )
                                    : (
                                        <Row gutter={[0, 0]}>
                                            {onBoardingSteps}
                                        </Row>
                                    )}
                            </Col>
                        </Row>
                    </PageContent>
                </AuthRequired>
                <ModalForm/>
            </PageWrapper>
        </>
    )
}

export default OnBoardingPage
