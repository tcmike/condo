// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import { CacheProvider } from '@emotion/core'
import { cache } from 'emotion'
import { ThunderboltFilled, HomeFilled, PieChartFilled } from '@ant-design/icons'

import whyDidYouRender from '@welldone-software/why-did-you-render'

import { withApollo } from '@core/next/apollo'
import { withAuth } from '@core/next/auth'
import { withIntl } from '@core/next/intl'
import { withOrganization } from '@core/next/organization'

import GlobalStyle from '@condo/domains/common/components/containers/GlobalStyle'
import GoogleAnalytics from '@condo/domains/common/components/containers/GoogleAnalytics'
import BehaviorRecorder from '@condo/domains/common/components/containers/BehaviorRecorder'
import BaseLayout from '@condo/domains/common/components/containers/BaseLayout'
import GlobalErrorBoundary from '@condo/domains/common/components/containers/GlobalErrorBoundery'
import { UserIcon } from '@condo/domains/common/components/icons/UserIcon'
import { GearIcon } from '@condo/domains/common/components/icons/GearIcon'

import { GET_ORGANIZATION_EMPLOYEE_BY_ID_QUERY } from '@condo/domains/organization/gql'
import { extractReqLocale } from '@condo/domains/common/utils/locale'

import { withMyContext } from '../state1'

import Icon from '@ant-design/icons'

import { useMyContext } from '../state1'

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    whyDidYouRender(React, {
        logOnDifferentValues: true,
    })
}

const UserXXXIconSVG: React.FC = () => {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 13C14.7614 13 17 10.7614 17 8C17 5.23858 14.7614 3 12 3C9.23857 3 6.99999 5.23858 6.99999 8C6.99999 10.7614 9.23857 13 12 13ZM12 13C18.6328 13 20.4538 18.843 20.8824 20.8401C20.9578 21.1913 20.6844 21.5 20.3253 21.5H3.67472C3.31556 21.5 3.04218 21.1913 3.11755 20.8401C3.54621 18.8431 5.36714 13 12 13Z" fill="currentColor"/>
        </svg>
    )
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const UserXXXIcon = props => {
    const { foo, data } = useMyContext()

    console.log('Render ICON!', foo, (data.objs) ? data.objs.length : 0)

    return (<>
        <Icon component={UserXXXIconSVG} {...props}/>
        <div>{foo} -- {data.loading}{(data.objs) ? data.objs.length : 0}</div>
    </>)
}

function menuDataRender () {
    return [
        {
            path: '/analytics',
            icon: PieChartFilled,
            locale: 'menu.Analytics',
        },
        {
            path: '/ticket',
            icon: ThunderboltFilled,
            locale: 'menu.ControlRoom',
        },
        {
            path: '/property',
            icon: HomeFilled,
            locale: 'menu.Property',
        },
        {
            path: '/contact',
            icon: UserIcon,
            locale: 'menu.Contacts',
        },
        {
            path: '/employee',
            icon: UserXXXIcon,
            locale: 'menu.Employees',
        },
        // TODO (savelevMatthew): Toggle this feature later
        // {
        //     path: '/settings',
        //     icon: GearIcon,
        //     locale: 'menu.Settings',
        // },
    ]
}

const MyApp = ({ Component, pageProps }) => {
    const LayoutComponent = Component.container || BaseLayout
    // TODO(Dimitreee): remove this mess later
    const HeaderAction = Component.headerAction
    const RequiredAccess = Component.requiredAccess || React.Fragment
    return (
        <GlobalErrorBoundary>
            <CacheProvider value={cache}>
                <Head>
                    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
                    />
                </Head>
                <GlobalStyle/>
                <LayoutComponent menuDataRender={menuDataRender} headerAction={HeaderAction}>
                    <RequiredAccess>
                        <Component {...pageProps} />
                    </RequiredAccess>
                </LayoutComponent>
                <GoogleAnalytics/>
                <BehaviorRecorder engine="plerdy"/>
            </CacheProvider>
        </GlobalErrorBoundary>
    )
}
const { publicRuntimeConfig: { defaultLocale } } = getConfig()

async function messagesImporter (locale) {
    const locale_data = await import(`../lang/${locale}`)
    return { ...locale_data.default }
}
/*
    Configuration for `InMemoryCache` of Apollo
    Add fields, related to pagination strategies of Apollo.
    Items of some GraphQL global fields needs to be appended to list,
    when paginated, rather than to be displayed as a slice of data, —
    its like "Infinite scrolling" UI pattern. For example, fetching
    more changes of a ticket on button click.
    For those items, we need to set `concatPagination` strategy.
    https://www.apollographql.com/docs/react/pagination/core-api/
 */
const apolloCacheConfig = {}

export default (
    withApollo({ ssr: true, apolloCacheConfig })(
        withIntl({ ssr: true, messagesImporter, extractReqLocale, defaultLocale })(
            withAuth({ ssr: true })(
                withOrganization({
                    ssr: true,
                    GET_ORGANIZATION_TO_USER_LINK_BY_ID_QUERY: GET_ORGANIZATION_EMPLOYEE_BY_ID_QUERY,
                })(withMyContext({ ssr: true })(MyApp))))))
