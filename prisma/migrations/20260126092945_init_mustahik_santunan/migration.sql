-- CreateTable
CREATE TABLE "Mustahik" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "profesi" TEXT NOT NULL,
    "asnaf" TEXT NOT NULL,
    "negara" TEXT NOT NULL DEFAULT 'Indonesia',
    "provinsi" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "rt" TEXT,
    "rw" TEXT,
    "alamat" TEXT NOT NULL,
    "fotoMustahik" TEXT,
    "ttdMustahik" TEXT,
    "dokumenLain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mustahik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Santunan" (
    "id" TEXT NOT NULL,
    "nominal" INTEGER NOT NULL,
    "program" TEXT NOT NULL,
    "jenisSantunan" TEXT NOT NULL,
    "ttdPenerima" TEXT,
    "dokumentasi" TEXT,
    "userId" TEXT NOT NULL,
    "mustahikId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Santunan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Santunan" ADD CONSTRAINT "Santunan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Santunan" ADD CONSTRAINT "Santunan_mustahikId_fkey" FOREIGN KEY ("mustahikId") REFERENCES "Mustahik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
