-- CreateTable
CREATE TABLE "public"."planilha1" (
    "Codigo" TEXT NOT NULL,
    "Loja" TEXT,
    "Nome" TEXT,
    "Fisica/Jurid" TEXT,
    "Endereco" TEXT,
    "N Fantasia" TEXT,
    "Bairro" TEXT,
    "Tipo" TEXT,
    "Estado" TEXT,
    "Cd.Municipio" TEXT,
    "CEP" TEXT,
    "Municipio" TEXT,
    "Regiao" TEXT,
    "Desc.Região" TEXT,
    "Natureza" TEXT,
    "End.Cobranca" TEXT,
    "Bairro Cob" TEXT,
    "DDD" TEXT,
    "Pes.Tri.Fav." TEXT,
    "Mun. Cobr." TEXT,
    "Uf de Cobr." TEXT,
    "DDI" TEXT,
    "End.Recebto" TEXT,
    "End.Entrega" TEXT,
    "Telefone" TEXT,
    "FAX" TEXT,
    "CNPJ/CPF" TEXT,
    "Contato" TEXT,

    CONSTRAINT "planilha1_pkey" PRIMARY KEY ("Codigo")
);

-- CreateIndex
CREATE INDEX "idx_planilha1_cnpj_cpf" ON "public"."planilha1"("CNPJ/CPF");

-- CreateIndex
CREATE INDEX "idx_planilha1_nome" ON "public"."planilha1"("Nome");

-- CreateIndex
CREATE INDEX "idx_planilha1_n_fantasia" ON "public"."planilha1"("N Fantasia");
