import { Col, Form, Input, Row, Typography } from 'antd'
import Router from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useIntl } from '@core/next/intl'
import { Button } from '@condo/domains/common/components/Button'
import { PhoneInput } from '@condo/domains/common/components/PhoneInput'
import { runMutation } from '@condo/domains/common/utils/mutations.utils'
import { getQueryParams } from '@condo/domains/common/utils/url.utils'
import { WRONG_PASSWORD_ERROR, WRONG_PHONE_ERROR } from '@condo/domains/user/constants/errors'
import { SIGNIN_BY_PHONE_AND_PASSWORD_MUTATION } from '@condo/domains/user/gql'
import { useMutation } from '@core/next/apollo'
import { useAuth } from '@core/next/auth'

const FORM_LAYOUT = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
}

export const SignInForm = (): React.ReactElement => {
    const intl = useIntl()
    const FieldIsRequiredMsg = intl.formatMessage({ id: 'FieldIsRequired' })
    const SignInMsg = intl.formatMessage({ id: 'SignIn' })
    const ExamplePhoneMsg = intl.formatMessage({ id: 'example.Phone' })
    const PasswordMsg = intl.formatMessage({ id: 'pages.auth.signin.field.Password' })
    const PhoneMsg = intl.formatMessage({ id: 'pages.auth.register.field.Phone' })
    const ResetMsg = intl.formatMessage({ id: 'pages.auth.signin.ResetPasswordLinkTitle' })
    const PasswordOrPhoneMismatch = intl.formatMessage({ id: 'pages.auth.WrongPhoneOrPassword' })

    const [form] = Form.useForm()
    const { next } = getQueryParams()
    const { refetch } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [signinByPhoneAndPassword] = useMutation(SIGNIN_BY_PHONE_AND_PASSWORD_MUTATION)
    const ErrorToFormFieldMsgMapping = useMemo(() => {
        return {
            [WRONG_PHONE_ERROR]: {
                name: 'signinError',
                errors: [PasswordOrPhoneMismatch],
            },
            [WRONG_PASSWORD_ERROR]: {
                name: 'signinError',
                errors: [PasswordOrPhoneMismatch],
            },
        }
    }, [intl])

    const onFormSubmit = useCallback((values) => {
        setIsLoading(true)

        return runMutation({
            mutation: signinByPhoneAndPassword,
            variables: values,
            onCompleted: () => {
                refetch().then(() => {
                    Router.push(next ? next : '/')
                })
            },
            onFinally: () => {
                setIsLoading(false)
            },
            intl,
            form,
            ErrorToFormFieldMsgMapping,
        }).catch(() => {
            setIsLoading(false)
        })
    }, [intl, form])

    const initialValues = { password: '', phone: '' }

    return (
        <Form
            {...FORM_LAYOUT}
            form={form}
            name='signin'
            labelAlign='left'
            onFinish={onFormSubmit}
            initialValues={initialValues}
            colon={false}
            requiredMark={false}
        >
            <Row gutter={[0, 30]}>
                <Col span={24} >
                    <Row gutter={[0, 24]}>
                        <Col span={24}>
                            <Form.Item
                                name='phone'
                                label={PhoneMsg}
                                rules={[{ required: true, message: FieldIsRequiredMsg }]}
                            >
                                <PhoneInput placeholder={ExamplePhoneMsg} tabIndex={1} block/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name='password'
                                label={PasswordMsg}
                                labelAlign='left'
                                rules={[{ required: true, message: FieldIsRequiredMsg }]}
                            >
                                <Input.Password tabIndex={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Row justify={'space-between'} align={'middle'} gutter={[0, 40]}>
                        <Col lg={7} xs={24}>
                            <Button
                                key='submit'
                                type='sberPrimary'
                                htmlType='submit'
                                loading={isLoading}
                                block
                            >
                                {SignInMsg}
                            </Button>
                        </Col>
                        <Col offset={3} lg={7} xs={24}>
                            <Button
                                type='sberAction'
                                icon={<SberIconWithoutLabel/>}
                                href={hasFeature('sbbol_auth') ? '/api/sbbol/auth' : ''}
                            >
                                {LoginBySbbolMessage}
                            </Button>
                        </Col>
                        <Col lg={14} xs={24}>
                            <Typography.Text type='secondary'>
                                <FormattedMessage
                                    id='pages.auth.signin.ResetPasswordLink'
                                    values={{
                                        link: (
                                            <Button type={'inlineLink'} size={'small'} onClick={() => Router.push('/auth/forgot')}>
                                                {ResetMsg}
                                            </Button>
                                        ),
                                    }}
                                />
                            </Typography.Text>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </Form>
    )
}
