import React, { useEffect, useRef, useState } from 'react'
import { OrganizationRequired } from '@condo/domains/organization/components/OrganizationRequired'
import { Col, notification, Row, TableColumnsType, Typography } from 'antd'
import dynamic from 'next/dynamic'
import { useIntl } from '@core/next/intl'
import TicketChartView from '@condo/domains/ticket/components/analytics/TicketChartView'
import TicketListView from '@condo/domains/ticket/components/analytics/TicketListView'
import { useLazyQuery } from '@core/next/apollo'
import { TICKET_ANALYTICS_REPORT_QUERY } from '@condo/domains/ticket/gql'
import { getQueryParams } from '@condo/domains/common/utils/url.utils'
import { useOrganization } from '@core/next/organization'
import get from 'lodash/get'
import { createPdfWithPageBreaks } from '@condo/domains/common/utils/pdf'
import moment from 'moment'
import { filterToQuery, getAggregatedData } from '@condo/domains/ticket/utils/helpers'
import { Loader } from '@condo/domains/common/components/Loader'
import { DATE_DISPLAY_FORMAT, PDF_REPORT_WIDTH } from '@condo/domains/ticket/constants/common'
import { Logo } from '@condo/domains/common/components/Logo'
import { colors } from '@condo/domains/common/constants/style'
import TicketChart from '@condo/domains/ticket/components/TicketChart'
import { TicketAnalyticsGroupBy, TicketGroupedCounter } from '../../../../schema'

const PdfView = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.PageTitle' })
    const AllAddresses = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.AllAddresses' })
    const SingleAddress = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.SingleAddress' })
    const AllCategories = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.AllCategories' })
    const DefaultTickets = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.DefaultTickets' })
    const PaidTickets = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.PaidTickets' })
    const EmergencyTickets = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.EmergencyTickets' })
    const LoadingTip = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.PDF.LoadingTip' })
    const containerRef = useRef<null | HTMLDivElement>(null)
    const queryParamsRef = useRef(null)
    const groupByRef = useRef<null | TicketAnalyticsGroupBy[]>(null)
    const mapperInstanceRef = useRef(null)

    const [data, setData] = useState<null | TicketGroupedCounter[]>(null)
    const [loading, setLoading] = useState(true)
    const userOrganization = useOrganization()
    const userOrganizationId = get(userOrganization, ['organization', 'id'])

    const [loadTicketAnalyticsData] = useLazyQuery(TICKET_ANALYTICS_REPORT_QUERY, {
        onError: error => {
            console.log(error)
            notification.error({
                message: intl.formatMessage(({ id: 'errors.PdfGenerationError' })),
                description: error,
            })
            setLoading(false)
        },
        fetchPolicy: 'network-only',
        onCompleted: response => {
            setLoading(false)
            const { result: { groups } } = response
            setData(groups)
        },
    })
    useEffect(() => {
        const queryParams = getQueryParams()
        queryParamsRef.current = queryParams
        const dateFrom = get(queryParams, 'dateFrom', moment().subtract(1, 'week'))
        const dateTo = get(queryParams, 'dateTo', moment())
        const addressList = JSON.parse(get(queryParams, 'addressList', '[]'))
        const mainGroup = get(queryParams, 'groupBy', 'status')
        const specification = get(queryParams, 'specification', 'day')
        const viewMode = get(queryParams, 'viewMode', 'line')
        const ticketType = get(queryParams, 'ticketType', 'all')
        const { AND, groupBy } = filterToQuery({
            viewMode,
            ticketType,
            filter: {
                range: [moment(dateFrom), moment(dateTo)],
                addressList,
                specification,
            },
            mainGroup,
        })
        groupByRef.current = groupBy
        const where = { organization: { id: userOrganizationId }, AND }

        loadTicketAnalyticsData({ variables: { data: { groupBy, where } } })

    }, [userOrganizationId])

    useEffect(() => {
        if (mapperInstanceRef.current === null && groupByRef.current !== null) {
            const mainGroup = get(queryParamsRef.current, 'groupBy', 'status')
            mapperInstanceRef.current = new TicketChart({
                line: {
                    chart: (viewMode, ticketGroupedCounter) => {
                        const data = getAggregatedData(ticketGroupedCounter, groupByRef.current)
                        const axisLabels = Array.from(new Set(Object.values(data).flatMap(e => Object.keys(e))))
                        const legend = Object.keys(data)
                        const series = []
                        Object.entries(data).map(([groupBy, dataObj]) => {
                            series.push({
                                name: groupBy,
                                type: viewMode,
                                symbol: 'none',
                                stack: groupBy,
                                data: Object.values(dataObj),
                                emphasis: {
                                    focus: 'none',
                                    blurScope: 'none',
                                },
                            })
                        })
                        const axisData = { yAxis: { type: 'value', data: null }, xAxis: { type: 'category', data: axisLabels } }
                        const tooltip = { trigger: 'axis', axisPointer: { type: 'line' } }
                        return { series, legend, axisData, tooltip }
                    },
                    table: (viewMode, ticketGroupedCounter, restOptions) => {
                        const data = getAggregatedData(ticketGroupedCounter, groupByRef.current)
                        const dataSource = []
                        const { translations, filters } = restOptions
                        const tableColumns: TableColumnsType = [
                            { title: translations['address'], dataIndex: 'address', key: 'address', sorter: (a, b) => a['address'] - b['address'] },
                            {
                                title: translations['date'],
                                dataIndex: 'date',
                                key: 'date',
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => moment(a['date'], DATE_DISPLAY_FORMAT).unix() - moment(b['date'], DATE_DISPLAY_FORMAT).unix(),
                            },
                            ...Object.entries(data).map(([key]) => ({ title: key, dataIndex: key, key, sorter: (a, b) =>a[key] - b[key] })),
                        ]
                        const uniqueDates = Array.from(new Set(Object.values(data).flatMap(e => Object.keys(e))))
                        uniqueDates.forEach((date, key) => {
                            const restTableColumns = {}
                            Object.keys(data).forEach(ticketType => (restTableColumns[ticketType] = data[ticketType][date]))
                            let address = translations['allAddresses']
                            const addressList = get(filters, 'addresses')
                            if (addressList && addressList.length) {
                                address = addressList.join(', ')
                            }
                            dataSource.push({ key, address, date, ...restTableColumns })
                        })
                        return { dataSource, tableColumns }
                    },
                },
                bar: {
                    chart: (viewMode, ticketGroupedCounter) => {
                        const data = getAggregatedData(ticketGroupedCounter, groupByRef.current)
                        const series = []
                        const axisLabels = Array.from(new Set(Object.values(data).flatMap(e => Object.keys(e))))
                        const legend = Object.keys(data)
                        Object.entries(data).map(([groupBy, dataObj]) => {
                            series.push({
                                name: groupBy,
                                type: viewMode,
                                symbol: 'none',
                                stack: 'total',
                                data: Object.values(dataObj),
                                emphasis: {
                                    focus: 'self',
                                    blurScope: 'self',
                                },
                            })
                        })
                        const axisData = { yAxis: { type: 'category', data: axisLabels }, xAxis: { type: 'value', data: null } }
                        const tooltip = { trigger: 'item', axisPointer: { type: 'line' } }
                        return { series, legend, axisData, tooltip }
                    },
                    table: (viewMode, ticketGroupedCounter, restOptions) => {
                        const data = getAggregatedData(ticketGroupedCounter, mainGroup === 'status' ? groupByRef.current.reverse() : groupByRef.current)
                        const { translations, filters } = restOptions
                        const dataSource = []
                        const tableColumns: TableColumnsType = [
                            { title: translations['address'], dataIndex: 'address', key: 'address', sorter: (a, b) => a['address'] - b['address'] },
                            ...Object.entries(data).map(([key]) => ({ title: key, dataIndex: key, key, sorter: (a, b) => a[key] - b[key] })),
                        ]
                        const restTableColumns = {}
                        const addressList = get(filters, 'addresses')
                        const aggregateSummary = addressList !== undefined && addressList.length === 0
                        if (aggregateSummary) {
                            Object.entries(data).forEach((rowEntry) => {
                                const [ticketType, dataObj] = rowEntry
                                const counts = Object.values(dataObj) as number[]
                                restTableColumns[ticketType] = counts.reduce((a, b) => a + b, 0)
                            })
                            dataSource.push({
                                key: 0,
                                address: translations['allAddresses'],
                                ...restTableColumns,
                            })
                        } else {
                            addressList.forEach((address, key) => {
                                const tableRow = { key, address }
                                Object.entries(data).forEach(rowEntry => {
                                    const [ticketType, dataObj] = rowEntry
                                    const counts = Object.entries(dataObj)
                                        .filter(obj => obj[0] === address).map(e => e[1]) as number[]
                                    tableRow[ticketType] = counts.reduce((a, b) => a + b, 0)
                                })
                                dataSource.push(tableRow)
                            })
                        }
                        return { dataSource, tableColumns }
                    },

                },
                pie: {
                    chart: (viewMode, ticketGroupedCounter) => {
                        const data = getAggregatedData(ticketGroupedCounter, groupByRef.current)
                        const series = []
                        Object.entries(data).forEach(([label, groupObject]) => {
                            const chartData = Object.entries(groupObject)
                                .map(([name, value]) => ({ name, value }))
                                .sort((a, b) => b.value - a.value)
                            series.push({
                                name: label,
                                data: chartData,
                                selectedMode: 'multiple',
                                type: viewMode,
                                radius: [50, 100],
                                symbol: 'none',
                                emphasis: {
                                    focus: 'self',
                                    blurScope: 'self',
                                },
                                labelLine: { show: false },
                                label: {
                                    show: true,
                                    // fontSize: 14,
                                    overflow: 'none',
                                    formatter: [
                                        '{value|{b}} {percent|{d} %}',
                                    ].join('\n'),
                                    rich: {
                                        value: {
                                            fontSize: 14,
                                            align: 'left',
                                            width: 100,
                                        },
                                        percent: {
                                            align: 'left',
                                            fontWeight: 700,
                                            fontSize: 14,
                                            width: 40,
                                        },
                                    },
                                },
                                labelLayout: (chart) =>  {
                                    const { dataIndex, seriesIndex } = chart
                                    const isLeftAlignedChart = seriesIndex % 2 === 0
                                    const xOffset = isLeftAlignedChart ? 300 : 900
                                    const elementYOffset = 25 * dataIndex
                                    const yOffset = 70 + 250 * Math.floor(seriesIndex / 2) + 10 + elementYOffset
                                    return {
                                        x: xOffset,
                                        y: yOffset,
                                        align: 'left',
                                        verticalAlign: 'top',
                                    }
                                },
                            })
                        })
                        return { series }
                    },
                    table: (viewMode, ticketGroupedCounter, restOptions) => {
                        const data = getAggregatedData(ticketGroupedCounter, groupByRef.current.reverse())
                        const { translations, filters } = restOptions
                        const dataSource = []
                        const tableColumns: TableColumnsType = [
                            { title: translations['address'], dataIndex: 'address', key: 'address', sorter: (a, b) => a['address'] - b['address'] },
                            ...Object.entries(data).map(([key]) => ({ title: key, dataIndex: key, key, sorter: (a, b) => a[key] - b[key] })),
                        ]

                        const restTableColumns = {}
                        const addressList = get(filters, 'addresses', [])
                        const aggregateSummary = addressList !== undefined && addressList.length === 0
                        if (aggregateSummary) {
                            const totalCount = Object.values(data)
                                .reduce((prev, curr) => prev + Object.values(curr)
                                    .reduce((a, b) => a + b, 0), 0)

                            Object.entries(data).forEach((rowEntry) => {
                                const [ticketType, dataObj] = rowEntry
                                const counts = Object.values(dataObj) as number[]
                                const percentString = ((counts
                                    .reduce((a, b) => a + b, 0) / totalCount) * 100)
                                    .toFixed(2) + ' %'
                                restTableColumns[ticketType] = percentString
                            })
                            dataSource.push({
                                key: 0,
                                address: translations['allAddresses'],
                                ...restTableColumns,
                            })
                        } else {
                            const totalCounts = {}
                            Object.values(data).forEach((dataObj) => {
                                Object.entries(dataObj).forEach(([propertyAddress, count]) => {
                                    if (get(totalCounts, propertyAddress, false)) {
                                        totalCounts[propertyAddress] += count
                                    } else {
                                        totalCounts[propertyAddress] = count
                                    }
                                })
                            })
                            addressList.forEach((address, key) => {
                                const tableRow = { key, address }
                                Object.entries(data).forEach(rowEntry => {
                                    const [ticketType, dataObj] = rowEntry
                                    const counts = Object.entries(dataObj)
                                        .filter(obj => obj[0] === address).map(e => e[1]) as number[]
                                    const totalPropertyCount = counts.reduce((a, b) => a + b, 0)
                                    tableRow[ticketType] = (totalPropertyCount / totalCounts[address] * 100)
                                        .toFixed(2) + ' %'
                                })
                                dataSource.push(tableRow)
                            })
                        }
                        return { dataSource, tableColumns }
                    },
                },
            })
        }
        if (!loading && data !== null) {
            createPdfWithPageBreaks({ element: containerRef.current, fileName: 'analytics_result.pdf' })
                .catch((e) => {
                    notification.error({
                        message: intl.formatMessage(({ id: 'errors.PdfGenerationError' })),
                        description: e.message,
                    })
                })
        }
    }, [loading, data])

    if (queryParamsRef.current === null ) {
        return null
    }
    let ticketTypeTitle = DefaultTickets
    const { dateFrom, dateTo, viewMode, ticketType, addressList, specification } = queryParamsRef.current
    ticketType === 'paid' && (ticketTypeTitle = PaidTickets)
    ticketType === 'emergency' && (ticketTypeTitle = EmergencyTickets)
    const addressListParsed = JSON.parse(addressList)
    const addressFilterTitle = addressListParsed.length ? `${SingleAddress} «${addressListParsed[0].value}»` : AllAddresses
    return <>
        {loading && <Loader fill spinning tip={LoadingTip} /> }
        <Row ref={containerRef} gutter={[0, 40]} style={{ width: PDF_REPORT_WIDTH, paddingLeft: 80, paddingRight: 120 }}>
            <Col flex={1} style={{ visibility: loading ? 'hidden' : 'visible', position: 'relative' }}>
                <Typography.Paragraph style={{ position: 'absolute', top: 0, right: 0 }}>
                    <Logo onClick={undefined} fillColor={colors.lightGrey[6]} />
                </Typography.Paragraph>
                <Typography.Title level={3}>{PageTitle}</Typography.Title>
                <Typography.Title level={4}>
                    {ticketTypeTitle} {moment(dateFrom).format('DD.MM.YYYY')} - {moment(dateTo).format('DD.MM.YYYY')} {addressFilterTitle} {AllCategories}
                </Typography.Title>
                <TicketChartView
                    data={data}
                    viewMode={viewMode}
                    onChartReady={() => setLoading(false)}
                    mapperInstance={mapperInstanceRef.current}
                    chartConfig={{
                        animationEnabled: false,
                        chartOptions: { renderer: 'svg' },
                    }}
                />
            </Col>
            <Col flex={1} >
                <TicketListView
                    mapperInstance={mapperInstanceRef.current}
                    data={data}
                    viewMode={viewMode}
                    filters={{
                        range: [dateFrom, dateTo],
                        addressList: addressListParsed,
                        specification: specification,
                    }}
                />
            </Col>
        </Row>
    </>
}

const DynamicPdfView = dynamic(() => Promise.resolve(PdfView), { ssr: false })

const AnalyticsPdfPage = () => (
    <DynamicPdfView />
)

AnalyticsPdfPage.container = ({ children }) => (
    <Typography.Paragraph style={{ padding: 40 }}>{children}</Typography.Paragraph>
)
AnalyticsPdfPage.requiredAccess = OrganizationRequired

export default AnalyticsPdfPage
