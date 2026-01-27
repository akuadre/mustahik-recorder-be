import { prisma } from "../config/db.js";

const createMustahikService = async (payload) => {
  return prisma.mustahik.create({
    data: payload,
  });
};

const getAllMustahikService = async (search) => {
  return prisma.mustahik.findMany({
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
};

const getMustahikByIdService = async (id) => {
  return prisma.mustahik.findUnique({
    where: { id },
  });
};

const updateMustahikService = async (id, payload) => {
  return prisma.mustahik.update({
    where: { id },
    data: payload,
  });
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
