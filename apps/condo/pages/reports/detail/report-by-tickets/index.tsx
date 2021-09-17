/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { css, jsx } from '@emotion/core'
import { getQueryParams } from '@condo/domains/common/utils/url.utils'
import Head from 'next/head'
import { useIntl } from '@core/next/intl'
import { PageContent, PageHeader, PageWrapper } from '@condo/domains/common/components/containers/BaseLayout'
import { OrganizationRequired } from '@condo/domains/organization/components/OrganizationRequired'
import { Col, Divider, Form, notification, Radio, Row, Select, TableColumnsType, Tabs, Tooltip, Typography } from 'antd'
import { useOrganization } from '@core/next/organization'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import sum from 'lodash/sum'
import { EXPORT_TICKET_ANALYTICS_TO_EXCEL, TICKET_ANALYTICS_REPORT_QUERY } from '@condo/domains/ticket/gql'
import { useLazyQuery } from '@core/next/apollo'

import dayjs, { Dayjs } from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { fontSizes } from '@condo/domains/common/constants/style'

import { BarChartIcon, LinearChartIcon, PieChartIcon } from '@condo/domains/common/components/icons/ChartIcons'
import { Button } from '@condo/domains/common/components/Button'
import { EditFilled, FilePdfFilled, PlusCircleFilled } from '@ant-design/icons'
import ActionBar from '@condo/domains/common/components/ActionBar'
import RadioGroupWithIcon, { radioButtonBorderlessCss } from '@condo/domains/common/components/RadioGroupWithIcon'
import { useRouter } from 'next/router'
import qs from 'qs'
import DateRangePicker from '@condo/domains/common/components/Pickers/DateRangePicker'
import TicketChart, { TicketSelectTypes, ViewModeTypes } from '@condo/domains/ticket/components/TicketChart'
import {
    filterToQuery,
    getAggregatedData,
    GroupTicketsByTypes,
    specificationTypes,
    ticketAnalyticsPageFilters,
} from '@condo/domains/ticket/utils/helpers'
import { GraphQlSearchInput } from '@condo/domains/common/components/GraphQlSearchInput'
import { searchProperty } from '@condo/domains/ticket/utils/clientSchema/search'
import { ReturnBackHeaderAction } from '@condo/domains/common/components/HeaderActions'
import TicketChartView from '@condo/domains/ticket/components/analytics/TicketChartView'
import TicketListView from '@condo/domains/ticket/components/analytics/TicketListView'
import { DATE_DISPLAY_FORMAT, TICKET_REPORT_DAY_GROUP_STEPS } from '@condo/domains/ticket/constants/common'
import { TicketGroupedCounter, TicketLabel } from '../../../../schema'
import { hasFeature } from '@condo/domains/common/components/containers/FeatureFlag'

dayjs.extend(quarterOfYear)

interface ITicketAnalyticsPage extends React.FC {
    headerAction?: JSX.Element
    requiredAccess?: React.FC
}

interface ITicketAnalyticsPageFilterProps {
    groupTicketsBy: GroupTicketsByTypes
    viewMode: ViewModeTypes
    onChange?: ({ range, specification, addressList }: ticketAnalyticsPageFilters) => void
}
const FORM_ITEM_STYLE = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
}
const DATE_RANGE_PRESETS = {
    week: [dayjs().subtract(1, 'week'), dayjs()],
    month: [dayjs().subtract(1, 'month'), dayjs()],
    quarter: [dayjs().subtract(1, 'quarter'), dayjs()],
    year: [dayjs().subtract(1, 'year'), dayjs()],
}

const tabsCss = css`
  & .ant-tabs-tab.ant-tabs-tab-active {
    font-weight: bold;
  }
  & .ant-tabs-nav {
    margin: 0;
  }
  & .ant-tabs-nav::before {
    border-bottom: unset;
  }
`

const TicketAnalyticsPageFilter: React.FC<ITicketAnalyticsPageFilterProps> = ({ groupTicketsBy, viewMode, onChange }) => {
    const router = useRouter()
    const intl = useIntl()
    const PeriodTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.PeriodTitle' })
    const SpecificationTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.SpecificationTitle' })
    const SpecificationDays = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.Specification.Days' })
    const SpecificationWeeks = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.Specification.Weeks' })
    const AllAddressesPlaceholder = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.AllAddressesPlaceholder' })
    const AddressTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.AddressTitle' })
    const ApplyButtonTitle = intl.formatMessage({ id: 'Show' })
    const PresetWeek = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.PeriodPreset.Week' })
    const PresetMonth = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.PeriodPreset.Month' })
    const PresetQuarter = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.PeriodPreset.Quarter' })
    const PresetYear = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.Filter.PeriodPreset.Year' })

    const userOrganization = useOrganization()
    const userOrganizationId = get(userOrganization, ['organization', 'id'])
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(1, 'week'), dayjs()])
    const [dateRangePreset, setDateRangePreset] = useState<null | string>(null)
    const [addressList, setAddressList] = useState([])
    const addressListRef = useRef([])
    const [specification, setSpecification] = useState<specificationTypes>(TICKET_REPORT_DAY_GROUP_STEPS[0] as specificationTypes)

    const updateUrlFilters = useCallback(() => {
        const [startDate, endDate] = dateRange
        router.push(`${router.route}?` + qs.stringify({
            createdAt_lte: startDate.format(DATE_DISPLAY_FORMAT),
            createdAt_gte: endDate.format(DATE_DISPLAY_FORMAT),
            specification,
            addressList: JSON.stringify(addressListRef.current),
            viewMode,
            groupTicketsBy,
        }))
    }, [dateRange, specification, addressList, viewMode, groupTicketsBy])

    useEffect(() => {
        const queryParams = getQueryParams()
        const addressList = JSON.parse(get(queryParams, 'addressList', '[]'))
        const startDate = get(queryParams, 'createdAt_lte', dayjs().subtract(1, 'week').format(DATE_DISPLAY_FORMAT))
        const endDate = get(queryParams, 'createdAt_gte', dayjs().format(DATE_DISPLAY_FORMAT))
        const range = [dayjs(startDate, DATE_DISPLAY_FORMAT), dayjs(endDate, DATE_DISPLAY_FORMAT)] as [Dayjs, Dayjs]
        const specificationUrl = get(queryParams, 'specification')
        if (startDate && endDate && specificationUrl && addressList) {
            addressListRef.current = addressList
            setAddressList(addressList.length ? addressList.map(e => e.value) : [])
            setDateRange(range)
            setSpecification(specificationUrl)
        }
        isEmpty(queryParams) && updateUrlFilters()
        onChange({ range, specification, addressList })
    }, [])

    useEffect(() => {
        dateRangePreset !== null && setDateRange(DATE_RANGE_PRESETS[dateRangePreset])
    }, [dateRangePreset])

    useEffect(() => {
        updateUrlFilters()
    }, [viewMode, groupTicketsBy])


    const applyFilters = useCallback(() => {
        updateUrlFilters()
        onChange({ range: dateRange, specification, addressList: addressListRef.current })
    }, [dateRange, specification, addressList, viewMode, groupTicketsBy])

    const searchAddress = useCallback(
        (client, query) => {
            const where = {
                address_contains_i: query,
                organization: { id: userOrganizationId },
            }

            return searchProperty(client, where, 'unitsCount_DESC')
        },
        [userOrganizationId],
    )

    const onAddressChange = useCallback((labelsList, searchObjectsList) => {
        setAddressList(labelsList as string[])
        addressListRef.current = [...searchObjectsList.map(({ key: id, title: value }) => ({ id, value }))]
    }, [addressList])
    const isDetailDisabled = groupTicketsBy === 'property' || viewMode === 'bar'
    return (
        <Form>
            <Row gutter={[44, 12]}>
                <Col flex={0}>
                    <Form.Item label={PeriodTitle} {...FORM_ITEM_STYLE} style={{ width: 240 }}>
                        <DateRangePicker
                            value={dateRange}
                            onChange={(range) => setDateRange(range)}
                        />
                        <Typography.Paragraph>
                            <Radio.Group
                                css={radioButtonBorderlessCss}
                                size={'small'}
                                onChange={preset => setDateRangePreset(preset.target.value)}
                            >
                                <Radio.Button value={'week'}>{PresetWeek}</Radio.Button>
                                <Radio.Button value={'month'}>{PresetMonth}</Radio.Button>
                                <Radio.Button value={'quarter'}>{PresetQuarter}</Radio.Button>
                                <Radio.Button value={'year'}>{PresetYear}</Radio.Button>
                            </Radio.Group>
                        </Typography.Paragraph>
                    </Form.Item>
                </Col>
                <Col flex={0}>
                    <Form.Item label={SpecificationTitle} {...FORM_ITEM_STYLE} style={{ width: 170 }}>
                        <Select value={specification} onChange={(e) => setSpecification(e)} disabled={isDetailDisabled}>
                            <Select.Option value={'day'}>{SpecificationDays}</Select.Option>
                            <Select.Option value={'week'}>{SpecificationWeeks}</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col flex={1} style={{ maxWidth: 746 }}>
                    <Form.Item label={AddressTitle} {...FORM_ITEM_STYLE}>
                        <GraphQlSearchInput
                            allowClear
                            search={searchAddress}
                            mode={'multiple'}
                            value={addressList}
                            onChange={onAddressChange}
                            maxTagCount='responsive'
                            placeholder={AllAddressesPlaceholder}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Button onClick={applyFilters} type={'sberPrimary'}>{ApplyButtonTitle}</Button>
                </Col>
            </Row>
        </Form>
    )
}

const TicketAnalyticsPage: ITicketAnalyticsPage = () => {
    const intl = useIntl()
    const PageTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.PageTitle' })
    const HeaderButtonTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.HeaderButtonTitle' })
    const ViewModeTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.ViewModeTitle' })
    const StatusFilterLabel = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.groupByFilter.Status' })
    const PropertyFilterLabel = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.groupByFilter.Property' })
    const CategoryFilterLabel = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.groupByFilter.Category' })
    const UserFilterLabel = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.groupByFilter.User' })
    const ResponsibleFilterLabel = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.groupByFilter.Responsible' })
    const TicketTypeAll = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.ticketType.AllTypes' })
    const TicketTypeDefault = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.ticketType.Default' })
    const TicketTypePaid = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.ticketType.Paid' })
    const TicketTypeEmergency = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.ticketType.Emergency' })
    const AllAddresses = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.AllAddresses' })
    const ManyAddresses = intl.formatMessage({ id:'pages.condo.analytics.TicketAnalyticsPage.ManyAddresses' })
    const AllAddressTitle = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.tableColumns.AllAddresses' })
    const SingleAddress = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.SingleAddress' })
    const AllCategories = intl.formatMessage({ id: 'pages.condo.analytics.TicketAnalyticsPage.AllCategories' })
    const TableTitle = intl.formatMessage({ id: 'Table' })
    const NotImplementedYetMessage = intl.formatMessage({ id: 'NotImplementedYet' })
    const PrintTitle = intl.formatMessage({ id: 'Print' })
    const ExcelTitle = intl.formatMessage({ id: 'Excel' })

    const router = useRouter()
    const userOrganization = useOrganization()
    const userOrganizationId = get(userOrganization, ['organization', 'id'])

    const filtersRef = useRef(null)
    const mapperInstanceRef = useRef(null)
    const ticketLabelsRef = useRef<TicketLabel[]>([])
    const [groupTicketsBy, setGroupTicketsBy] = useState<GroupTicketsByTypes>('status')
    const [viewMode, setViewMode] = useState<ViewModeTypes>('line')
    const [analyticsData, setAnalyticsData] = useState<null | TicketGroupedCounter[]>(null)
    const [excelDownloadLink, setExcelDownloadLink] = useState<null | string>(null)
    const [ticketType, setTicketType] = useState<TicketSelectTypes>('all')
    const [dateFrom, dateTo] = filtersRef.current !== null ? filtersRef.current.range : []
    const selectedPeriod = filtersRef.current !== null ? filtersRef.current.range.map(e => e.format(DATE_DISPLAY_FORMAT)).join(' - ') : ''
    const selectedAddresses = filtersRef.current !== null ? filtersRef.current.addressList : []

    const [loadTicketAnalytics, { loading }] = useLazyQuery(TICKET_ANALYTICS_REPORT_QUERY, {
        onError: error => {
            console.log(error)
            notification.error(error)
        },
        fetchPolicy: 'network-only',
        onCompleted: response => {
            const { result: { groups, ticketLabels } } = response
            ticketLabelsRef.current = ticketLabels
            setAnalyticsData(groups)
        },
    })
    const [exportTicketAnalyticsToExcel, { loading: isXSLXLoading }] = useLazyQuery(EXPORT_TICKET_ANALYTICS_TO_EXCEL, {
        onError: error => {
            console.log(error)
            notification.error(error)
        },
        fetchPolicy: 'network-only',
        onCompleted: response => {
            const { result: { link } } = response
            setExcelDownloadLink(link)
        },
    })
    const getAnalyticsData = useCallback(() => {
        if (filtersRef.current !== null) {
            const { AND, groupBy } = filterToQuery(
                { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
            )
            mapperInstanceRef.current = new TicketChart({
                line: {
                    chart: (viewMode, ticketGroupedCounter) => {
                        const { groupBy } = filterToQuery(
                            { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
                        )
                        const data = getAggregatedData(ticketGroupedCounter, groupBy)
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
                        const result = { series, legend, axisData, tooltip }
                        if (groupBy[0] === 'status') {
                            result['color'] = ticketLabelsRef.current.map(({ color }) => color)
                        }
                        return result
                    },
                    table: (viewMode, ticketGroupedCounter, restOptions) => {
                        const { groupBy } = filterToQuery(
                            { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
                        )
                        const data = getAggregatedData(ticketGroupedCounter, groupBy)
                        const dataSource = []
                        const { translations, filters } = restOptions
                        const tableColumns: TableColumnsType = [
                            { title: translations['address'], dataIndex: 'address', key: 'address', sorter: (a, b) => a['address'] - b['address'] },
                            {
                                title: translations['date'],
                                dataIndex: 'date',
                                key: 'date',
                                defaultSortOrder: 'descend',
                                sorter: (a, b) => dayjs(a['date'], DATE_DISPLAY_FORMAT).unix() - dayjs(b['date'], DATE_DISPLAY_FORMAT).unix(),
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
                        const { groupBy } = filterToQuery(
                            { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
                        )
                        const data = getAggregatedData(ticketGroupedCounter, groupBy)
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
                        const tooltip = { trigger: 'item', axisPointer: { type: 'line' }, borderColor: '#fff' }
                        const result = { series, legend, axisData, tooltip }
                        if (groupBy[0] === 'status') {
                            result['color'] = ticketLabelsRef.current.map(({ color }) => color)
                        }
                        return result
                    },
                    table: (viewMode, ticketGroupedCounter, restOptions) => {
                        const { groupBy } = filterToQuery(
                            { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
                        )
                        const data = getAggregatedData(ticketGroupedCounter, groupTicketsBy === 'status' ? groupBy.reverse() : groupBy)
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
                                restTableColumns[ticketType] = sum(counts)
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
                                    tableRow[ticketType] = sum(counts)
                                })
                                dataSource.push(tableRow)
                            })
                        }
                        return { dataSource, tableColumns }
                    },
                },
                pie: {
                    chart: (viewMode, ticketGroupedCounter) => {
                        const { groupBy } = filterToQuery(
                            { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
                        )
                        const data = getAggregatedData(ticketGroupedCounter, groupBy)
                        const series = []

                        const legend = [...new Set(Object.values(data).flatMap(e => Object.keys(e)))]
                        Object.entries(data).forEach(([label, groupObject]) => {
                            const chartData = Object.entries(groupObject)
                                .map(([name, value]) => ({ name, value }))
                            if (chartData.map(({ value }) => value).some(value => value > 0)) {
                                series.push({
                                    name: label,
                                    data: chartData,
                                    selectedMode: false,
                                    type: viewMode,
                                    radius: [60, 120],
                                    center: ['30%', '50%'],
                                    symbol: 'none',
                                    emphasis: {
                                        focus: 'self',
                                        blurScope: 'self',
                                    },
                                    labelLine: { show: false },
                                    label: {
                                        show: true,
                                        fontSize: fontSizes.content,
                                        overflow: 'none',
                                        formatter: [
                                            '{value|{b}} {percent|{d} %}',
                                        ].join('\n'),
                                        rich: {
                                            value: {
                                                fontSize: fontSizes.content,
                                                align: 'left',
                                                width: 100,
                                            },
                                            percent: {
                                                align: 'left',
                                                fontWeight: 700,
                                                fontSize: fontSizes.content,
                                                width: 40,
                                            },
                                        },
                                    },
                                    labelLayout: (chart) =>  {
                                        const { dataIndex, seriesIndex } = chart
                                        const elementYOffset = 25 * dataIndex
                                        const yOffset = 75 + 250 * Math.floor(seriesIndex / 2) + 10 + elementYOffset
                                        return {
                                            x: 380,
                                            y: yOffset,
                                            align: 'left',
                                            verticalAlign: 'top',
                                        }
                                    },
                                })
                            }
                        })
                        return { series, legend, color: ticketLabelsRef.current.map(({ color }) => color) }
                    },
                    table: (viewMode, ticketGroupedCounter, restOptions) => {
                        const { groupBy } = filterToQuery(
                            { filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy }
                        )
                        const data = getAggregatedData(ticketGroupedCounter, groupBy.reverse())
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
                                .reduce((prev, curr) => prev + sum(Object.values(curr)), 0)

                            Object.entries(data).forEach((rowEntry) => {
                                const [ticketType, dataObj] = rowEntry
                                const counts = Object.values(dataObj) as number[]
                                restTableColumns[ticketType] = totalCount > 0
                                    ? ((sum(counts) / totalCount) * 100).toFixed(2) + ' %'
                                    : totalCount
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
                                    const totalPropertyCount = sum(counts)
                                    tableRow[ticketType] = totalCounts[address] > 0
                                        ? (totalPropertyCount / totalCounts[address] * 100).toFixed(2) + ' %'
                                        : totalCounts[address]
                                })
                                dataSource.push(tableRow)
                            })
                        }
                        return { dataSource, tableColumns }
                    },
                },
            })
            const where = { organization: { id: userOrganizationId }, AND }
            loadTicketAnalytics({ variables: { data: { groupBy, where } } })
        }
    }, [userOrganizationId, viewMode, ticketType, groupTicketsBy])
    const propertyPageEnabled = hasFeature('analytics_property')

    useEffect(() => {
        const queryParams = getQueryParams()
        // TODO(sitozzz): remove when analytics_property feature flag is removed
        if (propertyPageEnabled) {
            setGroupTicketsBy(get(queryParams, 'groupTicketsBy', 'status'))
        } else {
            setGroupTicketsBy('status')
        }
        setViewMode(get(queryParams, 'viewMode', 'line'))
    }, [])

    useEffect(() => {
        getAnalyticsData()
    }, [groupTicketsBy, userOrganizationId, ticketType, viewMode])

    // Download excel file when file link was created
    useEffect(() => {
        if (excelDownloadLink !== null && !isXSLXLoading) {
            const link = document.createElement('a')
            link.href = excelDownloadLink
            link.target = '_blank'
            link.hidden = true
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            setExcelDownloadLink(null)
        }
    }, [excelDownloadLink, isXSLXLoading])


    const printPdf = useCallback(
        () => {
            router.push(router.route + '/pdf?' + qs.stringify({
                dateFrom: dateFrom.toISOString(),
                dateTo: dateTo.toISOString(),
                groupBy: groupTicketsBy,
                ticketType,
                viewMode,
                addressList: JSON.stringify(filtersRef.current.addressList),
                specification: filtersRef.current.specification,
            }))
        },
        [ticketType, viewMode, dateFrom, dateTo, groupTicketsBy, userOrganizationId],
    )

    const downloadExcel = useCallback(
        () => {
            const { AND, groupBy } = filterToQuery({ filter: filtersRef.current, viewMode, ticketType, mainGroup: groupTicketsBy })
            const where = { organization: { id: userOrganizationId }, AND }
            const translates = {
                property: filtersRef.current.addressList.length ?
                    filtersRef.current.addressList.map(({ value }) => value).join('@')
                    : AllAddressTitle,
            }

            exportTicketAnalyticsToExcel({ variables: { data: { groupBy, where, translates } } })
        },
        [ticketType, viewMode, dateFrom, dateTo, groupTicketsBy, userOrganizationId],
    )
    const onFilterChange: ITicketAnalyticsPageFilterProps['onChange'] = useCallback((filters) => {
        filtersRef.current = filters
        getAnalyticsData()
    }, [viewMode, ticketType, userOrganizationId])

    let addressFilterTitle = selectedAddresses.length === 0 ? AllAddresses : `${SingleAddress} «${selectedAddresses[0].value}»`
    if (selectedAddresses.length > 1) {
        addressFilterTitle = ManyAddresses
    }

    const isControlsDisabled = loading || isXSLXLoading || filtersRef.current === null
    return <>
        <Head>
            <title>{PageTitle}</title>
        </Head>
        <PageWrapper>
            <PageContent>
                <Row gutter={[40, 8]}>
                    <Col span={18}>
                        <PageHeader
                            style={{ width: '100%', padding: '0 0 16px' }}
                            title={<Typography.Title>{PageTitle}</Typography.Title>} />
                    </Col>
                    <Col span={6} style={{ textAlign: 'right', marginTop: 4 }}>
                        <Tooltip title={NotImplementedYetMessage}>
                            <Button icon={<PlusCircleFilled />} type='sberPrimary' secondary>{HeaderButtonTitle}</Button>
                        </Tooltip>
                    </Col>
                </Row>
                <Row gutter={[0, 24]} align={'top'} justify={'space-between'}>
                    <Col span={24}>
                        <Tabs
                            css={tabsCss}
                            defaultActiveKey='status'
                            activeKey={groupTicketsBy}
                            onChange={(key: GroupTicketsByTypes) => {
                                setGroupTicketsBy(key)
                                if (key === 'status') {
                                    setViewMode('line')
                                } else {
                                    setViewMode('bar')
                                }
                            }}
                        >
                            <Tabs.TabPane key='status' tab={StatusFilterLabel} />
                            <Tabs.TabPane
                                key='property'
                                tab={PropertyFilterLabel}
                                disabled={!propertyPageEnabled}
                            />
                            <Tabs.TabPane disabled key='category' tab={CategoryFilterLabel} />
                            <Tabs.TabPane disabled key='user' tab={UserFilterLabel} />
                            <Tabs.TabPane disabled key='responsible' tab={ResponsibleFilterLabel} />
                        </Tabs>
                    </Col>
                    <Col span={24}>
                        <TicketAnalyticsPageFilter
                            onChange={onFilterChange}
                            viewMode={viewMode}
                            groupTicketsBy={groupTicketsBy}
                        />
                        <Divider style={{ padding: 0, marginTop: 40, marginBottom: 16 }} />
                    </Col>
                    <Col span={16}>
                        <Typography.Title level={3}>
                            {ViewModeTitle} {selectedPeriod} {addressFilterTitle} {AllCategories}
                        </Typography.Title>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right', flexWrap: 'nowrap' }}>
                        <RadioGroupWithIcon
                            value={viewMode}
                            size='small'
                            buttonStyle='outline'
                            onChange={(e) => setViewMode(e.target.value)}>
                            {groupTicketsBy !== 'property' && (
                                <Radio.Button value='line'>
                                    <LinearChartIcon height={32} width={24} />
                                </Radio.Button>
                            )}
                            <Radio.Button value='bar'>
                                <BarChartIcon height={32} width={24} />
                            </Radio.Button>
                            {groupTicketsBy === 'property' && (
                                <Radio.Button value='pie'>
                                    <PieChartIcon height={32} width={24} />
                                </Radio.Button>
                            )}
                        </RadioGroupWithIcon>
                    </Col>
                    <Col span={24}>
                        {useMemo(() => (
                            <TicketChartView
                                data={analyticsData}
                                loading={loading}
                                viewMode={viewMode}
                                chartConfig={{
                                    animationEnabled: true,
                                    chartOptions: { renderer: 'svg', height: viewMode === 'line' ? 440 : 'auto' },
                                }}
                                mapperInstance={mapperInstanceRef.current}
                            >
                                <Select
                                    value={ticketType}
                                    onChange={(e) => setTicketType(e)}
                                    style={{ position: 'absolute', top: 0, right: 0, minWidth: '132px' }}
                                    disabled={loading}
                                >
                                    <Select.Option value='all'>{TicketTypeAll}</Select.Option>
                                    <Select.Option value='default'>{TicketTypeDefault}</Select.Option>
                                    <Select.Option value='paid'>{TicketTypePaid}</Select.Option>
                                    <Select.Option value='emergency'>{TicketTypeEmergency}</Select.Option>
                                </Select>
                            </TicketChartView>
                        ), [analyticsData, loading, viewMode, ticketType, userOrganizationId])}
                    </Col>
                    <Col span={24}>
                        <Typography.Title level={4} style={{ marginBottom: 20 }}>{TableTitle}</Typography.Title>
                        {useMemo(() => (
                            <TicketListView
                                data={analyticsData}
                                loading={loading}
                                viewMode={viewMode}
                                filters={filtersRef.current}
                                mapperInstance={mapperInstanceRef.current}
                            />
                        ), [analyticsData, loading, viewMode, ticketType, userOrganizationId])}
                    </Col>
                    <ActionBar fullscreen>
                        <Button disabled={isControlsDisabled || isEmpty(analyticsData)} onClick={printPdf} icon={<FilePdfFilled />} type='sberPrimary' secondary>
                            {PrintTitle}
                        </Button>
                        <Button disabled={isControlsDisabled || isEmpty(analyticsData)} onClick={downloadExcel} loading={isXSLXLoading} icon={<EditFilled />} type='sberPrimary' secondary>{ExcelTitle}</Button>
                    </ActionBar>
                </Row>
            </PageContent>
        </PageWrapper>
    </>
}

TicketAnalyticsPage.headerAction = <ReturnBackHeaderAction
    descriptor={{ id: 'pages.condo.analytics.TicketAnalyticsPage.PageTitle' }}
    path={'/reports/'} />
TicketAnalyticsPage.requiredAccess = OrganizationRequired
TicketAnalyticsPage.whyDidYouRender = false

export default TicketAnalyticsPage