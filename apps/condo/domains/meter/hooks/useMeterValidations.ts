import { useMemo } from 'react'
import { Dayjs } from 'dayjs'
import get from 'lodash/get'
import { Rule } from 'rc-field-form/lib/interface'
import { useIntl } from '@core/next/intl'
import isEmpty from 'lodash/isEmpty'

import { useOrganization } from '@core/next/organization'

import { Meter } from '../utils/clientSchema'

export const useMeterValidations = (installationDate: Dayjs, verificationDate: Dayjs) => {
    const intl = useIntl()
    const MeterWithSameNumberIsExistMessage = intl.formatMessage({ id: 'pages.condo.meter.MeterWithSameNumberIsExist' })
    const CanNotBeEarlierThanInstallationMessage = intl.formatMessage({ id: 'pages.condo.meter.СanNotBeEarlierThanInstallation' })
    const CanNotBeEarlierThanFirstVerificationMessage = intl.formatMessage({ id: 'pages.condo.meter.CanNotBeEarlierThanFirstVerification' })

    const { organization } = useOrganization()
    const organizationId = get(organization, 'id')
    const { objs: metersWithSameNumber, refetch } = Meter.useObjects({
        where: {
            organization: { id: organizationId },
        },
    })

    const earlierThanInstallationValidator: Rule = useMemo(() => ({
        validator: async (_, value) => {
            if (!value || !installationDate)
                return Promise.resolve()

            if (value.toDate() < installationDate.toDate()) {
                return Promise.reject(CanNotBeEarlierThanInstallationMessage)
            }

            return Promise.resolve()
        },
    }), [CanNotBeEarlierThanInstallationMessage, installationDate])

    const earlierThanFirstVerificationDateValidator: Rule = useMemo(() => ({
        validator: async (_, value) => {
            if (!value || !verificationDate)
                return Promise.resolve()

            if (value.toDate() < verificationDate.toDate()) {
                return Promise.reject(CanNotBeEarlierThanFirstVerificationMessage)
            }

            return Promise.resolve()
        },
    }), [CanNotBeEarlierThanFirstVerificationMessage, verificationDate])

    const meterWithSameNumberValidator: Rule = useMemo(() => ({
        validator: async (_, value) => {
            const { data: { objs } } = await refetch({
                where: {
                    organization: { id: organizationId },
                    number: value,
                },
            })

            if (!isEmpty(objs))
                return Promise.reject(MeterWithSameNumberIsExistMessage)

            return Promise.resolve()
        },
    }), [MeterWithSameNumberIsExistMessage, metersWithSameNumber, organizationId, refetch])

    return useMemo(() => (
        { meterWithSameNumberValidator, earlierThanFirstVerificationDateValidator, earlierThanInstallationValidator }
    ), [earlierThanFirstVerificationDateValidator, earlierThanInstallationValidator, meterWithSameNumberValidator])
}