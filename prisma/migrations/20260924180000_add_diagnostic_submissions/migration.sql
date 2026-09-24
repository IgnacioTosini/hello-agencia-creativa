-- CreateTable
CREATE TABLE "diagnostic_submissions" (
    "id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "recommendedServiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_submissions_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "inquiries"
ADD COLUMN "diagnosticSubmissionId" TEXT;

-- Preserve the diagnostic history already stored in inquiries.
INSERT INTO "diagnostic_submissions" (
    "id",
    "answers",
    "recommendedServiceId",
    "createdAt",
    "updatedAt"
)
SELECT
    'legacy-' || "id",
    COALESCE(
        "diagnosticAnswers",
        jsonb_strip_nulls(
            jsonb_build_object(
                'need', "diagnosticNeed",
                'situation', "diagnosticSituation",
                'business', "diagnosticBusiness"
            )
        )
    ),
    "recommendedServiceId",
    "createdAt",
    "updatedAt"
FROM "inquiries"
WHERE "source" = 'DIAGNOSTIC';

UPDATE "inquiries"
SET "diagnosticSubmissionId" = 'legacy-' || "id"
WHERE "source" = 'DIAGNOSTIC';

-- CreateIndex
CREATE INDEX "diagnostic_submissions_recommendedServiceId_idx"
ON "diagnostic_submissions"("recommendedServiceId");

-- CreateIndex
CREATE INDEX "diagnostic_submissions_createdAt_idx"
ON "diagnostic_submissions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_diagnosticSubmissionId_key"
ON "inquiries"("diagnosticSubmissionId");

-- AddForeignKey
ALTER TABLE "diagnostic_submissions"
ADD CONSTRAINT "diagnostic_submissions_recommendedServiceId_fkey"
FOREIGN KEY ("recommendedServiceId") REFERENCES "services"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries"
ADD CONSTRAINT "inquiries_diagnosticSubmissionId_fkey"
FOREIGN KEY ("diagnosticSubmissionId") REFERENCES "diagnostic_submissions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
