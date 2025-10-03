-- AlterTable
ALTER TABLE "public"."cursos" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."logs" (
    "id" SERIAL NOT NULL,
    "adminId" VARCHAR(36) NOT NULL,
    "descricao" VARCHAR(60) NOT NULL,
    "complemento" VARCHAR(200) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."logs" ADD CONSTRAINT "logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
