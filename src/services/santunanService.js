import { prisma } from "../config/db.js";

/**
 * Service untuk santunan
 */

const createSantunanService = async (payload) => {
  return prisma.santunan.create({
    data: payload,
    include: { user: true, mustahik: true },
  });
};

const getAllSantunanService = async (filter) => {
  return prisma.santunan.findMany({
    where: filter ? filter : undefined,
    include: { user: true, mustahik: true },
    orderBy: { createdAt: "desc" },
  });
};

const getSantunanByIdService = async (id) => {
  return prisma.santunan.findUnique({
    where: { id },
    include: { user: true, mustahik: true },
  });
};
const getSantunanSummaryService = async () => {
  // total nominal & total transaksi
  const aggregate = await prisma.santunan.aggregate({
    _sum: {
      nominal: true,
    },
    _count: {
      _all: true,
    },
  });

  // group by jenis santunan
  const perJenisRaw = await prisma.santunan.groupBy({
    by: ["jenisSantunan"],
    _sum: {
      nominal: true,
    },
    _count: {
      _all: true,
    },
  });

  const perJenis = perJenisRaw.map((item) => ({
    jenisSantunan: item.jenisSantunan,
    totalNominal: item._sum.nominal ?? 0,
    totalTransaksi: item._count._all,
  }));

  return {
    totalNominal: aggregate._sum.nominal ?? 0,
    totalTransaksi: aggregate._count._all,
    perJenis,
  };
};

export {
  createSantunanService,
  getAllSantunanService,
  getSantunanByIdService,
  getSantunanSummaryService,
};
