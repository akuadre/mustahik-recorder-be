import { prisma } from "../config/db.js";
import { calculateAge } from "../utils/calculateAge.js";

/**
 * helper untuk inject usia
 */
const withAge = (mustahik) => ({
  ...mustahik,
  usia: calculateAge(mustahik.tanggalLahir),
});

const createMustahikService = async (payload) => {
  const mustahik = prisma.mustahik.create({
    data: payload,
  });

  return withAge(mustahik);
};

const getAllMustahikService = async (search) => {
  const data = prisma.mustahik.findMany({
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
  });

  return data.map(withAge);
};

const getMustahikByIdService = async (id) => {
  const mustahik = prisma.mustahik.findUnique({
    where: { id },
  });

  return mustahik ? withAge(mustahik) : null;
};

const updateMustahikService = async (id, payload) => {
  const mustahik = prisma.mustahik.update({
    where: { id },
    data: payload,
  });

  return withAge(mustahik);
};

const deleteMustahikService = async (id) => {
  return prisma.mustahik.delete({
    where: { id },
  });
};

export {
  createMustahikService,
  getAllMustahikService,
  getMustahikByIdService,
  updateMustahikService,
  deleteMustahikService,
};
