-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "duration" TEXT,
ADD COLUMN     "instructor" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "level" TEXT DEFAULT 'Beginner',
ADD COLUMN     "price" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "enrollments" ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "description" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "is_preview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "video_url" TEXT;

-- CreateTable
CREATE TABLE "lesson_completions" (
    "id" TEXT NOT NULL,
    "enrollment_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lesson_completions_enrollment_id_lesson_id_key" ON "lesson_completions"("enrollment_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson_completions" ADD CONSTRAINT "lesson_completions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
