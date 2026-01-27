/*
  Warnings:

  - Made the column `kota` on table `Mustahik` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mustahik" ALTER COLUMN "kota" SET NOT NULL;
