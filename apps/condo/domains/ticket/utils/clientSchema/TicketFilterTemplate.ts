/**
 * Generated by `createschema ticket.TicketFilterTemplate 'name:Text; employee:Relationship:OrganizationEmployee:CASCADE; filters:Json'`
 */

import { pick, get } from 'lodash'

import { getClientSideSenderInfo } from '@condo/domains/common/utils/userid.utils'
import { generateReactHooks } from '@condo/domains/common/utils/codegeneration/generate.hooks'

import { TicketFilterTemplate as TicketFilterTemplateGQL } from '@condo/domains/ticket/gql'
import { TicketFilterTemplate, TicketFilterTemplateUpdateInput, QueryAllTicketFilterTemplatesArgs } from '../../../../schema'

const FIELDS = ['id', 'deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'updatedBy', 'name', 'employee', 'fields']
const RELATIONS = ['employee']

export interface ITicketFilterTemplateUIState extends TicketFilterTemplate {
    id: string
    // TODO(codegen): write ITicketFilterTemplateUIState or extends it from
}

function convertToUIState (item: TicketFilterTemplate): ITicketFilterTemplateUIState {
    if (item.dv !== 1) throw new Error('unsupported item.dv')
    return pick(item, FIELDS) as ITicketFilterTemplateUIState
}

export interface ITicketFilterTemplateFormState {
    id?: undefined
    // TODO(codegen): write ITicketFilterTemplateUIFormState or extends it from
}

function convertToUIFormState (state: ITicketFilterTemplateUIState): ITicketFilterTemplateFormState | undefined {
    if (!state) return
    const result = {}
    for (const attr of Object.keys(state)) {
        const attrId = get(state[attr], 'id')
        result[attr] = (RELATIONS.includes(attr) && state[attr]) ? attrId || state[attr] : state[attr]
    }
    return result as ITicketFilterTemplateFormState
}

function convertToGQLInput (state: ITicketFilterTemplateFormState): TicketFilterTemplateUpdateInput {
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
} = generateReactHooks<TicketFilterTemplate, TicketFilterTemplateUpdateInput, ITicketFilterTemplateFormState, ITicketFilterTemplateUIState, QueryAllTicketFilterTemplatesArgs>(TicketFilterTemplateGQL, { convertToGQLInput, convertToUIState })

export {
    useObject,
    useObjects,
    useCreate,
    useUpdate,
    useDelete,
    convertToUIFormState,
}
