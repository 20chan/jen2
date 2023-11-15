/*
  Warnings:

  - You are about to drop the `GoalRow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GoalRow";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "categoryMatch" TEXT NOT NULL,
    "target" INTEGER NOT NULL
);
