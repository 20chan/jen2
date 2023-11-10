-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "rulesSerialized" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "tag" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Category" ("archived", "color", "id", "label", "name", "rulesSerialized") SELECT "archived", "color", "id", "label", "name", "rulesSerialized" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
