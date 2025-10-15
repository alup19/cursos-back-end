/*
  Warnings:

  - You are about to alter the column `cidade` on the `clientes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "public"."clientes" ALTER COLUMN "email" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "cidade" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "public"."cursos" ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."duvidas" ALTER COLUMN "descricao" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."professores" ALTER COLUMN "email" SET DATA TYPE VARCHAR(60);
