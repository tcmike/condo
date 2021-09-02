/**
 * Generated by `createschema property.Property 'organization:Text; name:Text; address:Text; addressMeta:Json; type:Select:building,village; map?:Json'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */

const { generateGqlQueries } = require('@condo/domains/common/utils/codegeneration/generate.gql')
const { ADDRESS_META_SUBFIELDS_QUERY_LIST } = require('@condo/domains/common/utils/addressApi/addressMetaGql')
const { gql } = require('graphql-tag')

const COMMON_FIELDS = 'id dv sender { dv fingerprint } v deletedAt organization { id name} newId createdBy { id name } updatedBy { id name } createdAt updatedAt'
const PROPERTY_MAP_JSON_FIELDS = 'dv type sections { id type index name preview floors { id type index name units { id type name label preview } } }'
const PROPERTY_FIELDS = `{ name address addressMeta { ${ADDRESS_META_SUBFIELDS_QUERY_LIST} } type ticketsInWork ticketsClosed unitsCount map { ${PROPERTY_MAP_JSON_FIELDS} } ${COMMON_FIELDS} }`
const Property = generateGqlQueries('Property', PROPERTY_FIELDS)

const PROPERTY_MAP_GRAPHQL_TYPES = `
    enum BuildingMapEntityType {
        building
        section
        floor
        unit
        village
    }

    type BuildingUnit {
        id: String!
        type: BuildingMapEntityType!
        name: String
        label: String!
        preview: Boolean
    }

    type BuildingFloor {
        id: String!
        type: BuildingMapEntityType!
        index: Int!
        name: String!
        units: [BuildingUnit]!
    }

    type BuildingSection {
        id: String!
        type: BuildingMapEntityType!
        index: Int!
        name: String!
        floors: [BuildingFloor]!
        preview: Boolean  
    }

    type BuildingMap {
        dv: Int!
        sections: [BuildingSection]
        type: BuildingMapEntityType
    }
`

const GET_TICKET_INWORK_COUNT_BY_PROPERTY_ID_QUERY = gql`
    query GetTicketInWorkCountForProperty ($propertyId: ID!) {
        inwork: _allTicketsMeta(where: { status: { type_not:  closed }, property: { id: $propertyId } }) {
            count
        }  
  }
`
const GET_TICKET_CLOSED_COUNT_BY_PROPERTY_ID_QUERY = gql`
    query GetTicketInWorkCountForProperty ($propertyId: ID!) {
        closed: _allTicketsMeta(where: { status: { type:  closed }, property: { id: $propertyId } }) {
            count
        }  
  }
`

const CHECK_PROPERTY_WITH_ADDRESS_EXIST_QUERY = gql`
    query checkPropertyWithAddressExist ($data: CheckPropertyWithAddressExistInput!) {
        result: checkPropertyWithAddressExist(data: $data) { isFound }
    }
`

const EXPORT_PROPERTIES_TO_EXCEL =  gql`
    query exportPropertiesToExcel ($data: ExportPropertiesToExcelInput!) {
        result: exportPropertiesToExcel(data: $data) { status, linkToFile }
    }
`

/* AUTOGENERATE MARKER <CONST> */

module.exports = {
    Property,
    PROPERTY_MAP_GRAPHQL_TYPES,
    GET_TICKET_INWORK_COUNT_BY_PROPERTY_ID_QUERY,
    GET_TICKET_CLOSED_COUNT_BY_PROPERTY_ID_QUERY,
    CHECK_PROPERTY_WITH_ADDRESS_EXIST_QUERY,
    EXPORT_PROPERTIES_TO_EXCEL,

/* AUTOGENERATE MARKER <EXPORTS> */
}
