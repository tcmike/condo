// auto generated by kmigrator
// KMIGRATOR:0095_ticket_deadline_ticketchange_deadlinefrom_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMCBvbiAyMDIyLTAyLTAzIDA2OjE0Cgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMDk0X2F1dG9fMjAyMjAyMDJfMDY1OScpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0ndGlja2V0JywKICAgICAgICAgICAgbmFtZT0nZGVhZGxpbmUnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0ndGlja2V0Y2hhbmdlJywKICAgICAgICAgICAgbmFtZT0nZGVhZGxpbmVGcm9tJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J3RpY2tldGNoYW5nZScsCiAgICAgICAgICAgIG5hbWU9J2RlYWRsaW5lVG8nLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0ndGlja2V0aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2RlYWRsaW5lJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWx0ZXJGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0ndGlja2V0JywKICAgICAgICAgICAgbmFtZT0nb3JkZXInLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuSW50ZWdlckZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field deadline to ticket
--
ALTER TABLE "Ticket" ADD COLUMN "deadline" timestamp with time zone NULL;
--
-- Add field deadlineFrom to ticketchange
--
ALTER TABLE "TicketChange" ADD COLUMN "deadlineFrom" timestamp with time zone NULL;
--
-- Add field deadlineTo to ticketchange
--
ALTER TABLE "TicketChange" ADD COLUMN "deadlineTo" timestamp with time zone NULL;
--
-- Add field deadline to tickethistoryrecord
--
ALTER TABLE "TicketHistoryRecord" ADD COLUMN "deadline" timestamp with time zone NULL;
--
-- Alter field order on ticket
--
CREATE INDEX "Ticket_order_37bf7c3a" ON "Ticket" ("order");
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field order on ticket
--
DROP INDEX IF EXISTS "Ticket_order_37bf7c3a";
--
-- Add field deadline to tickethistoryrecord
--
ALTER TABLE "TicketHistoryRecord" DROP COLUMN "deadline" CASCADE;
--
-- Add field deadlineTo to ticketchange
--
ALTER TABLE "TicketChange" DROP COLUMN "deadlineTo" CASCADE;
--
-- Add field deadlineFrom to ticketchange
--
ALTER TABLE "TicketChange" DROP COLUMN "deadlineFrom" CASCADE;
--
-- Add field deadline to ticket
--
ALTER TABLE "Ticket" DROP COLUMN "deadline" CASCADE;
COMMIT;

    `)
}