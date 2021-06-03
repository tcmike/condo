/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Select, SelectProps, Typography } from 'antd'
import get from 'lodash/get'
import React from 'react'
import { BaseSearchInput } from '@condo/domains/common/components/BaseSearchInput'
import { useApolloClient } from '@core/next/apollo'
import { useOrganization } from '@core/next/organization'
import {
    rankedSearchProperties,
    searchSingleProperty,
} from '@condo/domains/ticket/utils/clientSchema/search'
import { Property } from '../../../schema'
import { Highliter } from '../../common/components/Highliter'

type IAddressSearchInput = SelectProps<string>

export const PropertyAddressSearchInput: React.FC<IAddressSearchInput> = (props) => {
    // TODO(Dimitree):remove ts ignore after useOrganizationTypo
    // @ts-ignore
    const { organization } = useOrganization()
    const client = useApolloClient()
    const organizationId = get(organization, 'id')

    const initialValueGetter = React.useCallback(
        (value) => {
            return searchSingleProperty(client, value, organizationId).then((property: Property) => {
                if (property) {
                    return property.address
                }
            })
        },
        [],
    )

    const searchAddress = React.useCallback(
        (query) => {
            return rankedSearchProperties(client, organizationId, query)
        },
        [],
    )

    const renderOption = React.useCallback(
        (dataItem, searchValue) => {
            return (
                <Select.Option
                    style={{ direction: 'rtl', textAlign: 'left' }}
                    key={dataItem.value}
                    value={dataItem.text}
                    title={dataItem.text}
                >
                    {
                        searchValue === dataItem.text
                            ? dataItem.text
                            : (
                                <Highliter
                                    text={dataItem.text}
                                    search={searchValue}
                                    renderPart={(part, index) => {
                                        return (
                                            <Typography.Text key={part + index} strong>{part}</Typography.Text>
                                        )
                                    }}
                                />
                            )
                    }
                </Select.Option>
            )
        },
        [],
    )

    return (
        <BaseSearchInput
            {...props}
            id={'propertyAddressSearchInput'}
            search={searchAddress}
            renderOption={renderOption}
            initialValueGetter={initialValueGetter}
        />
    )
}
