/*
  Warnings:

  - The values [0,1] on the enum `OtpStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [0,1] on the enum `OtpType` will be removed. If these variants are still used in the database, this will fail.

*/

-- First, delete all existing OTP records (they're temporary anyway)
TRUNCATE TABLE "otp";
TRUNCATE TABLE "otp_session";

-- AlterEnum for OtpStatus
BEGIN;
CREATE TYPE "OtpStatus_new" AS ENUM ('SENT', 'VERIFIED');
ALTER TABLE "public"."otp" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "otp" ALTER COLUMN "status" TYPE "OtpStatus_new" USING (
  CASE 
    WHEN "status"::text = '0' THEN 'SENT'::text
    WHEN "status"::text = '1' THEN 'VERIFIED'::text
    ELSE "status"::text
  END::"OtpStatus_new"
);
ALTER TYPE "OtpStatus" RENAME TO "OtpStatus_old";
ALTER TYPE "OtpStatus_new" RENAME TO "OtpStatus";
DROP TYPE "public"."OtpStatus_old";
ALTER TABLE "otp" ALTER COLUMN "status" SET DEFAULT 'SENT';
COMMIT;

-- AlterEnum for OtpType
BEGIN;
CREATE TYPE "OtpType_new" AS ENUM ('SIGNUP', 'RESET');
ALTER TABLE "otp" ALTER COLUMN "otp_type" TYPE "OtpType_new" USING (
  CASE
    WHEN "otp_type"::text = '0' THEN 'SIGNUP'::text
    WHEN "otp_type"::text = '1' THEN 'RESET'::text
    ELSE "otp_type"::text
  END::"OtpType_new"
);
ALTER TYPE "OtpType" RENAME TO "OtpType_old";
ALTER TYPE "OtpType_new" RENAME TO "OtpType";
DROP TYPE "public"."OtpType_old";
COMMIT;

-- AlterTable
ALTER TABLE "otp" ALTER COLUMN "status" SET DEFAULT 'SENT';

