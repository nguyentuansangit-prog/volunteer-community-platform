-- Week 7: Attendance and volunteer hours
CREATE TYPE "AttendanceStatus" AS ENUM ('ATTENDED', 'ABSENT');

CREATE TABLE "Attendance" (
  "id" TEXT NOT NULL,
  "registrationId" TEXT NOT NULL,
  "activityId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" "AttendanceStatus" NOT NULL,
  "volunteerHours" DECIMAL(6,2) NOT NULL DEFAULT 0,
  "recordedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Attendance_registrationId_key" ON "Attendance"("registrationId");
CREATE INDEX "Attendance_activityId_status_idx" ON "Attendance"("activityId", "status");
CREATE INDEX "Attendance_userId_status_idx" ON "Attendance"("userId", "status");

ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_registrationId_fkey"
FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_activityId_fkey"
FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_recordedById_fkey"
FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
