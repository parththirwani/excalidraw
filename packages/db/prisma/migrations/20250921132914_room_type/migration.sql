-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "type" "RoomType" NOT NULL DEFAULT 'PUBLIC';
