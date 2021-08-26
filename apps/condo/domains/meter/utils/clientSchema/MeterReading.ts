/**
 * Generated by `createschema meter.MeterReading 'organization:Relationship:Organization:CASCADE; property:Relationship:Property:CASCADE; account?:Relationship:BillingAccount:SET_NULL; billingAccountMeter?:Relationship:BillingAccountMeter:SET_NULL; date:DateTimeUtc; meter:Relationship:Meter:CASCADE; value:Integer; source:Relationship:MeterReadingSource:PROTECT'`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { MeterReading as MeterReadingGQL } from '@condo/domains/meter/gql'
import { MeterReading, MeterReadingUpdateInput, QueryAllMeterReadingsArgs } from '../../../../schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'organization', 'property', 'account', 'billingAccountMeter', 'date', 'meter', 'value', 'source']
const RELATIONS = ['organization', 'property', 'account', 'billingAccountMeter', 'meter', 'source']

export interface IMeterReadingUIState extends MeterReading {
    id: string
    // TODO(codegen): write IMeterReadingUIState or extends it from
}

function convertToUIState (item: MeterReading): IMeterReadingUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as IMeterReadingUIState
}

export interface IMeterReadingFormState {
    id?: undefined
    // TODO(codegen): write IMeterReadingUIFormState or extends it from
}

function convertToUIFormState (state: IMeterReadingUIState): IMeterReadingFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as IMeterReadingFormState
}

function convertToGQLInput (state: IMeterReadingFormState): MeterReadingUpdateInput {
    const sender = getClientSideSenderInfo()
    const result = { dv: 1, sender }
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? { connect: { id: (attrId || state[attr]) } } : state[attr]
    }
    return result
}

const {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
} = generateReactHooks<MeterReading, MeterReadingUpdateInput, IMeterReadingFormState, IMeterReadingUIState, QueryAllMeterReadingsArgs>(MeterReadingGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}