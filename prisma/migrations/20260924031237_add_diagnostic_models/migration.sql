-- CreateTable
CREATE TABLE "diagnostic_steps" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_answers" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "recommendationWeight" INTEGER NOT NULL DEFAULT 1,
    "recommendedServiceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_steps_key_key" ON "diagnostic_steps"("key");

-- CreateIndex
CREATE INDEX "diagnostic_steps_active_idx" ON "diagnostic_steps"("active");

-- CreateIndex
CREATE INDEX "diagnostic_steps_displayOrder_idx" ON "diagnostic_steps"("displayOrder");

-- CreateIndex
CREATE INDEX "diagnostic_answers_stepId_idx" ON "diagnostic_answers"("stepId");

-- CreateIndex
CREATE INDEX "diagnostic_answers_recommendedServiceId_idx" ON "diagnostic_answers"("recommendedServiceId");

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_answers_stepId_value_key" ON "diagnostic_answers"("stepId", "value");

-- AddForeignKey
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "diagnostic_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_recommendedServiceId_fkey" FOREIGN KEY ("recommendedServiceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
