import { Columns, MAX_TABLE_LENGTH, ObjectCreator, ProcessedRow, RowNormalizer, RowValidationErrorType, RowValidator, TableRow } from '@condo/domains/common/utils/importer'
import { useOrganization } from '@core/next/organization'
import { useApolloClient } from '@core/next/apollo'
import { useAddressApi } from '@condo/domains/common/components/AddressApi'
import get from 'lodash/get'
import map from 'lodash/map'
import { Meter, MeterReading } from '../utils/clientSchema'
import { searchProperty } from '@condo/domains/ticket/utils/clientSchema/search'
import { useIntl } from '@core/next/intl'
import { searchMeter } from '../utils/clientSchema/search'
import { SortMetersBy } from '../../../schema'
import {
    COLD_WATER_METER_RESOURCE_ID,
    ELECTRICITY_METER_RESOURCE_ID,
    GAS_SUPPLY_METER_RESOURCE_ID,
    HEAT_SUPPLY_METER_RESOURCE_ID,
    HOT_WATER_METER_RESOURCE_ID,
    IMPORT_CONDO_METER_READING_SOURCE_ID,
} from '../constants/constants'
import dayjs from 'dayjs'

type MeterReadingAddons = {
    address?: string;
    propertyId?: string;
    meterId?: string;
    meterResourceId?: string;
}
export const useImporterFunctions = () => {
    const intl = useIntl()

    // TODO: change to 'common.import' namespace
    const IncorrectRowFormatMessage = intl.formatMessage({ id: 'errors.import.IncorrectRowFormat' })
    const AddressNotFoundMessage = intl.formatMessage({ id: 'errors.import.AddressNotFound' })
    const PropertyNotFoundMessage = intl.formatMessage({ id: 'errors.import.PropertyNotFound' })

    // A separate translation namespace is used to make import feature independent on other
    // to avoid sudden regressed changes of column names when many clients will already use provided spreadsheet
    const AddressColumnMessage = intl.formatMessage({ id: 'meter.import.column.address' })
    const UnitNameColumnMessage = intl.formatMessage({ id: 'meter.import.column.unitName' })
    const AccountNumberColumnMessage = intl.formatMessage({ id: 'meter.import.column.accountNumber' })
    const MeterResourceTypeColumnMessage = intl.formatMessage({ id: 'meter.import.column.meterResourceType' })
    const MeterNumberColumnMessage = intl.formatMessage({ id: 'meter.import.column.meterNumber' })
    const MeterTariffsNumberColumnMessage = intl.formatMessage({ id: 'meter.import.column.meterTariffsNumber' })
    const Value1ColumnMessage = intl.formatMessage({ id: 'meter.import.column.value1' })
    const Value2ColumnMessage = intl.formatMessage({ id: 'meter.import.column.value2' })
    const Value3ColumnMessage = intl.formatMessage({ id: 'meter.import.column.value3' })
    const Value4ColumnMessage = intl.formatMessage({ id: 'meter.import.column.value4' })
    const VerificationDateMessage = intl.formatMessage({ id: 'meter.import.column.VerificationDate' })
    const NextVerificationDateMessage = intl.formatMessage({ id: 'meter.import.column.NextVerificationDate' })
    const InstallationDateMessage = intl.formatMessage({ id: 'meter.import.column.InstallationDate' })
    const CommissioningDateMessage = intl.formatMessage({ id: 'meter.import.column.CommissioningDate' })
    const SealingDateMessage = intl.formatMessage({ id: 'meter.import.column.SealingDate' })
    const ControlReadingsDate = intl.formatMessage({ id: 'meter.import.column.ControlReadingsDate' })

    const MeterResourceNotFoundMessage = intl.formatMessage({ id: 'meter.import.error.MeterResourceNotFound' })

    const HotWaterResourceTypeValue = intl.formatMessage({ id: 'meter.import.value.meterResourceType.hotWater' })
    const ColdWaterResourceTypeValue = intl.formatMessage({ id: 'meter.import.value.meterResourceType.coldWater' })
    const ElectricityResourceTypeValue = intl.formatMessage({ id: 'meter.import.value.meterResourceType.electricity' })
    const HeatSupplyResourceTypeValue = intl.formatMessage({ id: 'meter.import.value.meterResourceType.heatSupply' })
    const GasSupplyResourceTypeValue = intl.formatMessage({ id: 'meter.import.value.meterResourceType.gasSupply' })
    

    const userOrganization = useOrganization()
    const client = useApolloClient()
    const { addressApi } = useAddressApi()

    const userOrganizationId = get(userOrganization, ['organization', 'id'])

    const meterCreateAction = Meter.useCreate({},
        () => Promise.resolve())

    const meterReadingCreateAction = MeterReading.useCreate({},
        () => Promise.resolve())

    // const DateVer
    const columns: Columns = [
        { name: AddressColumnMessage, type: 'string', required: true, label: 'address' },
        { name: UnitNameColumnMessage, type: 'string', required: true, label: 'unitName' },
        { name: AccountNumberColumnMessage, type: 'string', required: true, label: 'accountNumber' },
        { name: MeterResourceTypeColumnMessage, type: 'string', required: true, label: 'meterResourceType' },
        { name: MeterNumberColumnMessage, type: 'string', required: true, label: 'meterNumber' },
        { name: MeterTariffsNumberColumnMessage, type: 'string', required: true, label: 'meterTariffsNumber' },
        { name: Value1ColumnMessage, type: 'string', required: false, label: 'value1' },
        { name: Value2ColumnMessage, type: 'string', required: false, label: 'value2' },
        { name: Value3ColumnMessage, type: 'string', required: false, label: 'value3' },
        { name: Value4ColumnMessage, type: 'string', required: false, label: 'value4' },
        { name: VerificationDateMessage, type: 'date', required: false, label: 'verificationDate' },
        { name: NextVerificationDateMessage, type: 'date', required: false, label: 'nextVerificationDate' },
        { name: InstallationDateMessage, type: 'date', required: false, label: 'installationDate' },
        { name: CommissioningDateMessage, type: 'date', required: false, label: 'commissioningDate' },
        { name: SealingDateMessage, type: 'date', required: false, label: 'sealingDate' },
        { name: ControlReadingsDate, type: 'date', required: false, label: 'controlReadingsDate' },
    ]

    const meterReadingNormalizer: RowNormalizer<MeterReadingAddons> = async (row) => {
        const addons: MeterReadingAddons = { address: null, propertyId: null, meterId: null, meterResourceId: null }
        if (row.length !== columns.length) return Promise.resolve({ row })
        const [
            address,
            unitName,
            accountNumber,
            meterResourceTypeAbbr,
            meterNumber,
        ] = map(row, 'value')

        // Current suggestion API provider returns no suggestions for address with flat number
        const suggestionOptions = await addressApi.getSuggestions(String(address))
        const suggestion = get(suggestionOptions, ['suggestions', 0])
        if (!suggestion) {
            return { row, addons }
        }
        // Used tell whether suggestion API has found specified address at all
        addons.address = suggestion.value

        const propertyOptions = await searchProperty(client, {
            organization: { id: userOrganizationId },
            address: suggestion.value,
        }, undefined)

        const propertyId = propertyOptions.length > 0 ? get(propertyOptions[0], 'value') : null
        if (!propertyId) {
            return { row, addons }
        }

        addons.propertyId = propertyId

        const searchMeterWhereConditions = {
            organization: { id: userOrganizationId },
            property: { id: propertyId },
            unitName,
            accountNumber,
            number: meterNumber,
        }

        const meterOptions = await searchMeter(client, searchMeterWhereConditions, SortMetersBy.CreatedAtDesc)
        addons.meterId = meterOptions.length > 0 ? meterOptions[0].value : null

        const METER_RESOURCE_ABBREVIATION_TO_ID = {
            [HotWaterResourceTypeValue]: HOT_WATER_METER_RESOURCE_ID,
            [ColdWaterResourceTypeValue]: COLD_WATER_METER_RESOURCE_ID,
            [ElectricityResourceTypeValue]: ELECTRICITY_METER_RESOURCE_ID,
            [HeatSupplyResourceTypeValue]: HEAT_SUPPLY_METER_RESOURCE_ID,
            [GasSupplyResourceTypeValue]: GAS_SUPPLY_METER_RESOURCE_ID,
        }
        addons.meterResourceId = METER_RESOURCE_ABBREVIATION_TO_ID[String(meterResourceTypeAbbr)]

        return { row, addons }
    }

    const addonsToErrorMapper: Partial<Record<keyof MeterReadingAddons, string>> = {
        ['address']: AddressNotFoundMessage,
        ['propertyId']: PropertyNotFoundMessage,
        ['meterResourceId']: MeterResourceNotFoundMessage,
    }

    const meterReadingValidator: RowValidator<MeterReadingAddons> = (processedRow) => {
        if (!processedRow) return Promise.resolve(false)
        const errors = []
        if (!processedRow.addons) errors.push(IncorrectRowFormatMessage)
        else {
            Object.keys(addonsToErrorMapper).forEach((key: keyof MeterReadingAddons) => {
                if (!processedRow.addons[key]) errors.push(addonsToErrorMapper[key])
            })
        }
        // processedRow.row.
        if (errors.length) {
            processedRow.errors = errors
            return Promise.resolve(false)
        }
        return Promise.resolve(true)
    }

    const meterReadingCreator: ObjectCreator<MeterReadingAddons> = async ({ row, addons }) => {
        if (!row) return Promise.resolve()
        const [
            address,
            unitName,
            accountNumber,
            meterResourceType,
            meterNumber,
            numberOfTariffs,
            value1,
            value2,
            value3,
            value4,
            verificationDate,
            nextVerificationDate,
            installationDate,
            commissioningDate,
            sealingDate,
            controlReadingsDate,
        ] = map(row, 'value')

        let meterId
        if (addons.meterId) {
            meterId = addons.meterId
        } else {
            const newMeter = await meterCreateAction({
                organization: String(userOrganizationId),
                property: String(addons.propertyId),
                resource: addons.meterResourceId,
                unitName: String(unitName),
                accountNumber: String(accountNumber),
                number: String(meterNumber),
                numberOfTariffs: parseInt(String(numberOfTariffs)),
                verificationDate: dayjs(verificationDate).toISOString(),
                nextVerificationDate: dayjs(nextVerificationDate).toISOString(),
                installationDate: dayjs(installationDate).toISOString(),
                commissioningDate: dayjs(commissioningDate).toISOString(),
                sealingDate: (sealingDate ? dayjs(sealingDate) : dayjs()).toISOString(),
                controlReadingsDate: dayjs(controlReadingsDate).toISOString(),
            })
            meterId = get(newMeter, 'id')
        }

        return meterReadingCreateAction({
            organization: String(userOrganizationId),
            meter: meterId,
            source: IMPORT_CONDO_METER_READING_SOURCE_ID,
            // GraphQL input requirements for decimal and date field type should be passed as strings.
            // It conflicts with typing system, so they are marked to be ignored by TypeScript
            // @ts-ignore
            value1,
            // @ts-ignore
            value2,
            // @ts-ignore
            value3,
            // @ts-ignore
            value4,
            // @ts-ignore
            date: controlReadingsDate,
        })
    }

    const ImportErrorMessage = intl.formatMessage({ id: 'ImportError' })
    const TooManyRowsErrorMessage = intl.formatMessage({ id: 'TooManyRowsInTable' }, {
        value: MAX_TABLE_LENGTH,
    })
    const InvalidHeadersErrorMessage = intl.formatMessage({ id: 'TableHasInvalidHeaders' }, {
        value: columns.map(column => `"${column.name}"`).join(', '),
    })

    const metersRowErrorsProcessor = (row: ProcessedRow) => {
        row.errors.forEach((error, i) => {
            let message
            switch (error.type) {
                case RowValidationErrorType.InvalidTypes: {
                    const column = columns[error.metadata.columnIndex]
                    message = intl.formatMessage({ id: 'meter.import.error.InvalidColumnTypes' },
                        {
                            columnName: column.name,
                            requiredType: intl.formatMessage({ id: `meter.import.error.column.${column.label}.requiredType` }),
                            example: intl.formatMessage({ id: `meter.import.error.column.${column.label}.example` }),
                        })
                    break
                }
                case RowValidationErrorType.InvalidColumns: 
                    message = InvalidHeadersErrorMessage
                    break
                case RowValidationErrorType.TooManyRows:
                    message = TooManyRowsErrorMessage
                    break
                default:
                    message = ImportErrorMessage
                    break
            }
            row.errors[i].message = message
        })
        return row.errors
    }

    return [columns, meterReadingNormalizer, meterReadingValidator, meterReadingCreator, metersRowErrorsProcessor] as const
}
