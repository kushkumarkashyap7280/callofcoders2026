-- CreateEnum
CREATE TYPE "OtpType" AS ENUM ('0', '1');

-- CreateEnum
CREATE TYPE "OtpStatus" AS ENUM ('0', '1');

-- CreateTable
CREATE TABLE "otp" (
    "email" TEXT NOT NULL,
    "otp_type" "OtpType" NOT NULL,
    "status" "OtpStatus" NOT NULL DEFAULT '0',
    "otp_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "otp_session" (
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attempts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "otp_session_pkey" PRIMARY KEY ("email")
);
