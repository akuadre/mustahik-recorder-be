import { prisma } from "../config/db.js";
import { calculateAge } from "../utils/calculateAge.js";

/**
 * helper untuk inject usia
 */

// const withAge = (mustahik) => ({
//   ...mustahik,
//   usia: calculateAge(mustahik.tanggalLahir),
// });

const withAge = (mustahik) => {
  const { id, nama, ...rest } = mustahik;
  return { id, nama, usia: calculateAge(mustahik.tanggalLahir), ...rest };
};

const createMustahikService = async (payload) => {
  const mustahik = await prisma.mustahik.create({
    data: payload,
    select: {
      id: true,
      nama: true,
      tanggalLahir: true,
      profesi: true,
      asnaf: true,
      kota: true,
      kecamatan: true,
      kelurahan: true,
      fotoMustahik: true,
      ttdMustahik: true,
      dokumenLain: true,
    },
  });

  return withAge(mustahik);
};

const getAllMustahikService = async (search) => {
  const data = await prisma.mustahik.findMany({
    where: search
      ? {
          OR: [
            { nama: { contains: search, mode: "insensitive" } },
            { profesi: { contains: search, mode: "insensitive" } },
            { asnaf: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nama: true,
      tanggalLahir: true,
      kota: true,
      kecamatan: true,
      asnaf: true,
      fotoMustahik: true,
    },
  });

  return data.map(withAge);
};

const getMustahikByIdService = async (id) => {
  const mustahik = await prisma.mustahik.findUnique({
    where: { id },
    select: {
      id: true,
      nama: true,
      tanggalLahir: true,
      profesi: true,
      asnaf: true,
      kota: true,
      kecamatan: true,
      kelurahan: true,
      fotoMustahik: true,
    },
  });

  return mustahik ? withAge(mustahik) : null;
};

const updateMustahikService = async (id, payload) => {
  const mustahik = await prisma.mustahik.update({
    where: { id },
    data: payload,
  });

  return withAge(mustahik);
};

const deleteMustahikService = async (id) => {
  await prisma.mustahik.delete({
    where: { id },
  });

  return true;
};

export {
  createMustahikService,
  getAllMustahikService,
  getMustahikByIdService,
  updateMustahikService,
  deleteMustahikService,
};
