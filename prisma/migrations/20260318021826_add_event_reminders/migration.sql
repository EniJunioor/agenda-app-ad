-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "remindOneDayBefore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remindTwoHoursBefore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remindedOneDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "remindedTwoHours" BOOLEAN NOT NULL DEFAULT false;
