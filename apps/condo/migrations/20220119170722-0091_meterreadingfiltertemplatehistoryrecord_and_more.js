// auto generated by kmigrator
// KMIGRATOR:0091_meterreadingfiltertemplatehistoryrecord_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMCBvbiAyMDIyLTAxLTE5IDEyOjA3Cgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCmltcG9ydCBkamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMDkwX2FsdGVyX21ldGVycmVhZGluZ3NvdXJjZV90eXBlJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkNyZWF0ZU1vZGVsKAogICAgICAgICAgICBuYW1lPSdtZXRlcnJlYWRpbmdmaWx0ZXJ0ZW1wbGF0ZWhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBmaWVsZHM9WwogICAgICAgICAgICAgICAgKCdkdicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3NlbmRlcicsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25hbWUnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdlbXBsb3llZScsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2ZpZWxkcycsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2lkJywgbW9kZWxzLlVVSURGaWVsZChwcmltYXJ5X2tleT1UcnVlLCBzZXJpYWxpemU9RmFsc2UpKSwKICAgICAgICAgICAgICAgICgndicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEJ5JywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnZGVsZXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25ld0lkJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9kYXRlJywgbW9kZWxzLkRhdGVUaW1lRmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfYWN0aW9uJywgbW9kZWxzLkNoYXJGaWVsZChjaG9pY2VzPVsoJ2MnLCAnYycpLCAoJ3UnLCAndScpLCAoJ2QnLCAnZCcpXSwgbWF4X2xlbmd0aD01MCkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2lkJywgbW9kZWxzLlVVSURGaWVsZChkYl9pbmRleD1UcnVlKSksCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgIG9wdGlvbnM9ewogICAgICAgICAgICAgICAgJ2RiX3RhYmxlJzogJ01ldGVyUmVhZGluZ0ZpbHRlclRlbXBsYXRlSGlzdG9yeVJlY29yZCcsCiAgICAgICAgICAgIH0sCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkNyZWF0ZU1vZGVsKAogICAgICAgICAgICBuYW1lPSd0aWNrZXRmaWx0ZXJ0ZW1wbGF0ZWhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBmaWVsZHM9WwogICAgICAgICAgICAgICAgKCdkdicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3NlbmRlcicsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25hbWUnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdlbXBsb3llZScsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2ZpZWxkcycsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2lkJywgbW9kZWxzLlVVSURGaWVsZChwcmltYXJ5X2tleT1UcnVlLCBzZXJpYWxpemU9RmFsc2UpKSwKICAgICAgICAgICAgICAgICgndicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEJ5JywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnZGVsZXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25ld0lkJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9kYXRlJywgbW9kZWxzLkRhdGVUaW1lRmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfYWN0aW9uJywgbW9kZWxzLkNoYXJGaWVsZChjaG9pY2VzPVsoJ2MnLCAnYycpLCAoJ3UnLCAndScpLCAoJ2QnLCAnZCcpXSwgbWF4X2xlbmd0aD01MCkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2lkJywgbW9kZWxzLlVVSURGaWVsZChkYl9pbmRleD1UcnVlKSksCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgIG9wdGlvbnM9ewogICAgICAgICAgICAgICAgJ2RiX3RhYmxlJzogJ1RpY2tldEZpbHRlclRlbXBsYXRlSGlzdG9yeVJlY29yZCcsCiAgICAgICAgICAgIH0sCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkNyZWF0ZU1vZGVsKAogICAgICAgICAgICBuYW1lPSd0aWNrZXRmaWx0ZXJ0ZW1wbGF0ZScsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ2R2JywgbW9kZWxzLkludGVnZXJGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2VuZGVyJywgbW9kZWxzLkpTT05GaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnbmFtZScsIG1vZGVscy5UZXh0RmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2ZpZWxkcycsIG1vZGVscy5KU09ORmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2lkJywgbW9kZWxzLlVVSURGaWVsZChwcmltYXJ5X2tleT1UcnVlLCBzZXJpYWxpemU9RmFsc2UpKSwKICAgICAgICAgICAgICAgICgndicsIG1vZGVscy5JbnRlZ2VyRmllbGQoZGVmYXVsdD0xKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnZGVsZXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25ld0lkJywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSdjcmVhdGVkQnknLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudXNlcicpKSwKICAgICAgICAgICAgICAgICgnZW1wbG95ZWUnLCBtb2RlbHMuRm9yZWlnbktleShkYl9jb2x1bW49J2VtcGxveWVlJywgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uQ0FTQ0FERSwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLm9yZ2FuaXphdGlvbmVtcGxveWVlJykpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQnknLCBtb2RlbHMuRm9yZWlnbktleShibGFuaz1UcnVlLCBkYl9jb2x1bW49J3VwZGF0ZWRCeScsIG51bGw9VHJ1ZSwgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uU0VUX05VTEwsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS51c2VyJykpLAogICAgICAgICAgICBdLAogICAgICAgICAgICBvcHRpb25zPXsKICAgICAgICAgICAgICAgICdkYl90YWJsZSc6ICdUaWNrZXRGaWx0ZXJUZW1wbGF0ZScsCiAgICAgICAgICAgIH0sCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkNyZWF0ZU1vZGVsKAogICAgICAgICAgICBuYW1lPSdtZXRlcnJlYWRpbmdmaWx0ZXJ0ZW1wbGF0ZScsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ2R2JywgbW9kZWxzLkludGVnZXJGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2VuZGVyJywgbW9kZWxzLkpTT05GaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnbmFtZScsIG1vZGVscy5UZXh0RmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2ZpZWxkcycsIG1vZGVscy5KU09ORmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2lkJywgbW9kZWxzLlVVSURGaWVsZChwcmltYXJ5X2tleT1UcnVlLCBzZXJpYWxpemU9RmFsc2UpKSwKICAgICAgICAgICAgICAgICgndicsIG1vZGVscy5JbnRlZ2VyRmllbGQoZGVmYXVsdD0xKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnZGVsZXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25ld0lkJywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSdjcmVhdGVkQnknLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudXNlcicpKSwKICAgICAgICAgICAgICAgICgnZW1wbG95ZWUnLCBtb2RlbHMuRm9yZWlnbktleShkYl9jb2x1bW49J2VtcGxveWVlJywgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uQ0FTQ0FERSwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLm9yZ2FuaXphdGlvbmVtcGxveWVlJykpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQnknLCBtb2RlbHMuRm9yZWlnbktleShibGFuaz1UcnVlLCBkYl9jb2x1bW49J3VwZGF0ZWRCeScsIG51bGw9VHJ1ZSwgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uU0VUX05VTEwsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS51c2VyJykpLAogICAgICAgICAgICBdLAogICAgICAgICAgICBvcHRpb25zPXsKICAgICAgICAgICAgICAgICdkYl90YWJsZSc6ICdNZXRlclJlYWRpbmdGaWx0ZXJUZW1wbGF0ZScsCiAgICAgICAgICAgIH0sCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model meterreadingfiltertemplatehistoryrecord
--
CREATE TABLE "MeterReadingFilterTemplateHistoryRecord" ("dv" integer NULL, "sender" jsonb NULL, "name" text NULL, "employee" uuid NULL, "fields" jsonb NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Create model ticketfiltertemplatehistoryrecord
--
CREATE TABLE "TicketFilterTemplateHistoryRecord" ("dv" integer NULL, "sender" jsonb NULL, "name" text NULL, "employee" uuid NULL, "fields" jsonb NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Create model ticketfiltertemplate
--
CREATE TABLE "TicketFilterTemplate" ("dv" integer NOT NULL, "sender" jsonb NOT NULL, "name" text NOT NULL, "fields" jsonb NOT NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "createdBy" uuid NULL, "employee" uuid NOT NULL, "updatedBy" uuid NULL);
--
-- Create model meterreadingfiltertemplate
--
CREATE TABLE "MeterReadingFilterTemplate" ("dv" integer NOT NULL, "sender" jsonb NOT NULL, "name" text NOT NULL, "fields" jsonb NOT NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "createdBy" uuid NULL, "employee" uuid NOT NULL, "updatedBy" uuid NULL);
CREATE INDEX "MeterReadingFilterTemplateHistoryRecord_history_id_d482767a" ON "MeterReadingFilterTemplateHistoryRecord" ("history_id");
CREATE INDEX "TicketFilterTemplateHistoryRecord_history_id_9ebad648" ON "TicketFilterTemplateHistoryRecord" ("history_id");
ALTER TABLE "TicketFilterTemplate" ADD CONSTRAINT "TicketFilterTemplate_createdBy_41d0db30_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "TicketFilterTemplate" ADD CONSTRAINT "TicketFilterTemplate_employee_bd60f0ba_fk_Organizat" FOREIGN KEY ("employee") REFERENCES "OrganizationEmployee" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "TicketFilterTemplate" ADD CONSTRAINT "TicketFilterTemplate_updatedBy_c37b30ea_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "TicketFilterTemplate_createdAt_fedf7989" ON "TicketFilterTemplate" ("createdAt");
CREATE INDEX "TicketFilterTemplate_updatedAt_67c5b224" ON "TicketFilterTemplate" ("updatedAt");
CREATE INDEX "TicketFilterTemplate_deletedAt_8cba6a96" ON "TicketFilterTemplate" ("deletedAt");
CREATE INDEX "TicketFilterTemplate_createdBy_41d0db30" ON "TicketFilterTemplate" ("createdBy");
CREATE INDEX "TicketFilterTemplate_employee_bd60f0ba" ON "TicketFilterTemplate" ("employee");
CREATE INDEX "TicketFilterTemplate_updatedBy_c37b30ea" ON "TicketFilterTemplate" ("updatedBy");
ALTER TABLE "MeterReadingFilterTemplate" ADD CONSTRAINT "MeterReadingFilterTemplate_createdBy_ff3c3a6a_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "MeterReadingFilterTemplate" ADD CONSTRAINT "MeterReadingFilterTe_employee_616c1509_fk_Organizat" FOREIGN KEY ("employee") REFERENCES "OrganizationEmployee" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "MeterReadingFilterTemplate" ADD CONSTRAINT "MeterReadingFilterTemplate_updatedBy_b05dc906_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "MeterReadingFilterTemplate_createdAt_04b61594" ON "MeterReadingFilterTemplate" ("createdAt");
CREATE INDEX "MeterReadingFilterTemplate_updatedAt_e89a2260" ON "MeterReadingFilterTemplate" ("updatedAt");
CREATE INDEX "MeterReadingFilterTemplate_deletedAt_a8e2f89e" ON "MeterReadingFilterTemplate" ("deletedAt");
CREATE INDEX "MeterReadingFilterTemplate_createdBy_ff3c3a6a" ON "MeterReadingFilterTemplate" ("createdBy");
CREATE INDEX "MeterReadingFilterTemplate_employee_616c1509" ON "MeterReadingFilterTemplate" ("employee");
CREATE INDEX "MeterReadingFilterTemplate_updatedBy_b05dc906" ON "MeterReadingFilterTemplate" ("updatedBy");
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model meterreadingfiltertemplate
--
DROP TABLE "MeterReadingFilterTemplate" CASCADE;
--
-- Create model ticketfiltertemplate
--
DROP TABLE "TicketFilterTemplate" CASCADE;
--
-- Create model ticketfiltertemplatehistoryrecord
--
DROP TABLE "TicketFilterTemplateHistoryRecord" CASCADE;
--
-- Create model meterreadingfiltertemplatehistoryrecord
--
DROP TABLE "MeterReadingFilterTemplateHistoryRecord" CASCADE;
COMMIT;

    `)
}