-- CreateTable
CREATE TABLE "GoalRow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "categoryMatch" TEXT NOT NULL,
    "target" INTEGER NOT NULL
);
