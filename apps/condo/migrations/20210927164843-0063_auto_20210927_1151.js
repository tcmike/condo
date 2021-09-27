// auto generated by kmigrator
// KMIGRATOR:0063_auto_20210927_1151:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDMuMi41IG9uIDIwMjEtMDktMjcgMTE6NTEKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAwNjJfYXV0b18yMDIxMDkyN18wNzQ3JyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdvcmdhbml6YXRpb25lbXBsb3llZXJvbGUnLAogICAgICAgICAgICBuYW1lPSdjYW5NYW5hZ2VNZXRlclJlYWRpbmdzJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkJvb2xlYW5GaWVsZChkZWZhdWx0PVRydWUpLAogICAgICAgICAgICBwcmVzZXJ2ZV9kZWZhdWx0PUZhbHNlLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nb3JnYW5pemF0aW9uZW1wbG95ZWVyb2xlaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2Nhbk1hbmFnZU1ldGVyUmVhZGluZ3MnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field canManageMeterReadings to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" ADD COLUMN "canManageMeterReadings" boolean DEFAULT true NOT NULL;
ALTER TABLE "OrganizationEmployeeRole" ALTER COLUMN "canManageMeterReadings" DROP DEFAULT;
--
-- Add field canManageMeterReadings to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" ADD COLUMN "canManageMeterReadings" boolean NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field canManageMeterReadings to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" DROP COLUMN "canManageMeterReadings" CASCADE;
--
-- Add field canManageMeterReadings to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" DROP COLUMN "canManageMeterReadings" CASCADE;
COMMIT;

    `)
}