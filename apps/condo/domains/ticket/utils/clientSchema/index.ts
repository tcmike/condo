/**
 * This file is autogenerated by `createschema ticket.Ticket organization:Text; statusReopenedCounter:Integer; statusReason?:Text; status:Relationship:TicketStatus:PROTECT; number?:Integer; client?:Relationship:User:SET_NULL; clientName:Text; clientEmail:Text; clientPhone:Text; operator:Relationship:User:SET_NULL; assignee?:Relationship:User:SET_NULL; classifier:Relationship:TicketClassifier:PROTECT; details:Text; meta?:Json;`
 * In most cases you should not change it by hands. And please don't remove `AUTOGENERATE MARKER`s
 */

export * as Ticket from './Ticket'
export * as TicketStatus from './TicketStatus'
export * as TicketSource from './TicketSource'
export * as TicketChange from './TicketChange'
export * as TicketFile from './TicketFile'
export * as TicketClassifier from './TicketClassifier'
export * as TicketPlaceClassifier from './TicketPlaceClassifier'
export * as TicketCategoryClassifier from './TicketCategoryClassifier'
export * as TicketProblemClassifier from './TicketProblemClassifier'
export * as TicketClassifierRule from './TicketClassifierRule'
export * as TicketComment from './TicketComment'
export * as TicketFilterTemplate from './TicketFilterTemplate'
/* AUTOGENERATE MARKER <IMPORT-EXPORT> */
