/*
  Warnings:

  - You are about to drop the column `categoryManualy` on the `Transaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATETIME NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "memo" TEXT NOT NULL
);
INSERT INTO "new_Transaction" ("amount", "balance", "content", "createdAt", "date", "id", "kind", "memo") SELECT "amount", "balance", "content", "createdAt", "date", "id", "kind", "memo" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE TABLE "new_CategoriesOnTransaction" (
    "transactionId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manuallyAssigned" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("transactionId", "categoryId"),
    CONSTRAINT "CategoriesOnTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CategoriesOnTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategoriesOnTransaction" ("assignedAt", "categoryId", "transactionId") SELECT "assignedAt", "categoryId", "transactionId" FROM "CategoriesOnTransaction";
DROP TABLE "CategoriesOnTransaction";
ALTER TABLE "new_CategoriesOnTransaction" RENAME TO "CategoriesOnTransaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
