import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import { PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { OrganizationRequired } from '@condo/domains/organization/components/OrganizationRequired'
import { TitleHeaderAction } from '@condo/domains/common/components/HeaderActions'
import { useAuth } from '@core/next/auth'
import { useOrganization } from '@core/next/organization'
import get from 'lodash/get'
import { Loader } from '@condo/domains/common/components/Loader'
import { notification } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

const { publicRuntimeConfig: { importServiceUrl } } = getConfig()
const importHost = importServiceUrl.split('/import')[0]

const UploadRegistryPage = () => {
    const { user } = useAuth()
    const { organization } = useOrganization()
    const [loading, setIsLoading] = useState(true)

    const handleLoad = () => {
        setIsLoading(false)
    }

    const handleMessage = (event) => {
        if (event.origin !== importHost) {
            return
        }
        notification.info({ message: event.data })
    }

    useEffect(() => {
        window.addEventListener('message', handleMessage, false)

        return () => {
            window.removeEventListener('message', handleMessage)
        }
    }, [])



    return (
        <>
            <Head>
                <title>
                    Это что, страница с айфреймом?!?
                </title>
            </Head>
            <PageWrapper>
                User: {get(user, 'id')}
                <br/>
                Org: {get(organization, 'id')}
                <br/>
                {dayjs('2021-12-10T04:41:04.310Z').local().format('DD MMMM YYYY, HH:mm')}
                {}
                {
                    loading && <Loader/>
                }
                <iframe src={importServiceUrl} style={loading ? { visibility: 'hidden' } : {}} onLoad={handleLoad}>

                </iframe>
            </PageWrapper>
        </>
    )
}

UploadRegistryPage.headerAction = <TitleHeaderAction descriptor={{ id: 'НИФИГА' }}/>
UploadRegistryPage.requiredAccess = OrganizationRequired

export default UploadRegistryPage
