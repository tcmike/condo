const { gql } = require('graphql-tag')


const GET_PROPERTY_BY_ID_QUERY = gql`
    query GetPropertyByIdQuery ($propertyId: ID!, $organizationId: ID) {
        objs: allProperties(where: {id: $propertyId, organization: { id: $organizationId }}) {
            id
            address
        }
    }
`

const GET_RANKED_PROPERTIES_QUERY = gql`
    query GetRankedProperties ($organizationId: ID!, $address: String, $rankOrder: String, $first: Int) {
        objs: rankedProperties (organizationId: $organizationId, address: $address, rankOrder: $rankOrder, first: $first) {
            id
            address
        }
    }
`

const GET_ALL_SOURCES_QUERY = gql`
    query selectSource ($value: String, $organizationId: ID) {
        objs: allTicketSources(where: {name_contains: $value, organization: { id: $organizationId }}) {
            id
            name
        }
    }
`

// TODO(pahaz): add organization relation to existing classifiers
const GET_ALL_CLASSIFIERS_QUERY = gql`
    query selectSource ($value: String) {
        objs: allTicketClassifiers(where: {name_contains_i: $value, organization_is_null: true, parent_is_null: true}) {
            id
            name
        }
    }
`

const GET_ALL_PROPERTIES_BY_VALUE_QUERY = gql`
    query selectProperty ($value: String, $organizationId: ID) {
        objs: allProperties(where: {address_contains_i: $value, organization: { id: $organizationId }}, first: 10) {
            id
            address
        }
    }
`

const GET_ALL_ORGANIZATION_EMPLOYEE_QUERY = gql`
    query selectOrgarnizationEmployee ($value: String, $organizationId: ID) {
        objs: allOrganizationEmployees(where: {name_contains_i: $value, organization: { id: $organizationId }}) {
            name
            id
            user {
                id
            }
        }
    }
`

async function _search (client, query, variables) {
    return await client.query({
        query: query,
        variables: variables,
        fetchPolicy: 'network-only',
    })
}

export function searchProperty (organizationId) {
    return async function (client, value) {
        const { data = [], error } = await _search(client, GET_ALL_PROPERTIES_BY_VALUE_QUERY, { value, organizationId })
        if (error) console.warn(error)
        if (data) return data.objs.map(x => ({ text: x.address, value: x.id }))
        return []
    }
}

export async function searchSingleProperty (client, propertyId, organizationId) {
    const { data, error } = await _search(client, GET_PROPERTY_BY_ID_QUERY, { propertyId, organizationId })

    if (error) {
        console.warn(error)
    }

    if (!data) {
        return undefined
    }

    return data.objs[0]
}

export async function rankedSearchProperties (client, organizationId, query, first = 10) {
    const { data, error } = await _search(client, GET_RANKED_PROPERTIES_QUERY, { organizationId, rankOrder: 'ASC', first, address: query })
    if (error) {
        console.warn(error)
    }

    if (data) {
        return data.objs.map(x => ({ text: x.address, value: x.id }))
    }

    return []
}

export async function searchTicketSources (client, value) {
    const { data, error } = await _search(client, GET_ALL_SOURCES_QUERY, { value })
    if (error) console.warn(error)
    if (data) return data.objs.map(x => ({ text: x.name, value: x.id }))
    return []
}

export async function searchTicketClassifier (client, value) {
    const { data, error } = await _search(client, GET_ALL_CLASSIFIERS_QUERY, { value })
    if (error) console.warn(error)
    if (data) return data.objs.map(x => ({ text: x.name, value: x.id }))
    return []
}

export function searchEmployee (organizationId) {
    return async function (client, value) {
        const { data, error } = await _search(client, GET_ALL_ORGANIZATION_EMPLOYEE_QUERY, { value, organizationId })
        if (error) console.warn(error)

        return data.objs.map(object => {
            if (object.user) {
                return ({ text: object.name, value: object.user.id })
            }
        }).filter(Boolean)
    }
}