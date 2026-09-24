CREATE TABLE "site_content" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "homeSections" JSONB NOT NULL,
    "contactBudgets" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);
