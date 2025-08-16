-- CreateTable
CREATE TABLE "public"."analytics" (
    "id" SERIAL NOT NULL,
    "employerId" INTEGER NOT NULL,
    "totalJobsPosted" INTEGER NOT NULL DEFAULT 0,
    "totalApplicationsReceived" INTEGER NOT NULL DEFAULT 0,
    "totalHired" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analytics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."analytics" ADD CONSTRAINT "analytics_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
