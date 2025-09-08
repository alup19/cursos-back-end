-- CreateTable
CREATE TABLE "tiposcursos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "tiposcursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores" (
    "id" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "telefone" VARCHAR(11) NOT NULL,
    "endereco" VARCHAR(100) NOT NULL,
    "aprovado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(30) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "foto" TEXT NOT NULL,
    "cargaHoraria" VARCHAR(5) NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT true,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "professorId" VARCHAR(36) NOT NULL,
    "tipoCursoId" INTEGER NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "duvidas" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "resposta" TEXT,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "clienteId" VARCHAR(36) NOT NULL,
    "cursoId" INTEGER NOT NULL,

    CONSTRAINT "duvidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_At" TIMESTAMP(3) NOT NULL,
    "endereco" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(11) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_tipoCursoId_fkey" FOREIGN KEY ("tipoCursoId") REFERENCES "tiposcursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duvidas" ADD CONSTRAINT "duvidas_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "duvidas" ADD CONSTRAINT "duvidas_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
