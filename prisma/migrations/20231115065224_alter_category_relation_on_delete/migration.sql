-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CategoriesOnTransaction" (
    "transactionId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "manuallyAssigned" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("transactionId", "categoryId"),
    CONSTRAINT "CategoriesOnTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CategoriesOnTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CategoriesOnTransaction" ("assignedAt", "categoryId", "manuallyAssigned", "transactionId") SELECT "assignedAt", "categoryId", "manuallyAssigned", "transactionId" FROM "CategoriesOnTransaction";
DROP TABLE "CategoriesOnTransaction";
ALTER TABLE "new_CategoriesOnTransaction" RENAME TO "CategoriesOnTransaction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
