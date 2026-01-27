import { prisma } from "../config/db.js";
import { successResponse, errorResponse } from "../utils/response.js";

const createMustahik = async (req, res) => {
  try {
    const {
      nama,
      tempatLahir,
      tanggalLahir,
      profesi,
      asnaf,
      negara,
      provinsi,
      kecamatan,
      kelurahan,
      rt,
      rw,
      alamat,
    } = req.body;

    // VALIDASI
    if (
      !nama ||
      !tempatLahir ||
      !tanggalLahir ||
      !profesi ||
      !asnaf ||
      !provinsi ||
      !kecamatan ||
      !kelurahan ||
      !alamat
    ) {
      return errorResponse(res, "Data mustahik tidak lengkap", 400);
    }

    // ambil file dari multer
    const fotoMustahik = req.files?.fotoMustahik?.[0]?.filename || null;
    const ttdMustahik = req.files?.ttdMustahik?.[0]?.filename || null;
    const dokumenLain = req.files?.dokumenLain?.[0]?.filename || null;

    const mustahik = await prisma.mustahik.create({
      data: {
        nama,
        tempatLahir,
        tanggalLahir: new Date(tanggalLahir),
        profesi,
        asnaf,
        negara: negara || "Indonesia",
        provinsi,
        kecamatan,
        kelurahan,
        rt,
        rw,
        alamat,
        fotoMustahik,
        ttdMustahik,
        dokumenLain,
      },
    });

    return successResponse(
      res,
      "Mustahik berhasil ditambahkan",
      { mustahik },
      201,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getAllMustahik = async (req, res) => {
  try {
    const { search } = req.query;

    const mustahik = await prisma.mustahik.findMany({
      where: search
        ? {
            OR: [{ nama: { contains: search, mode: "insensitive" } }],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return successResponse(
      res,
      "Data mustahik berhasil diambil",
      { mustahik },
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getMustahikById = async (req, res) => {
  try {
    const { id } = req.params;

    const mustahik = await prisma.mustahik.findUnique({
      where: { id },
    });

    if (!mustahik) {
      return errorResponse(res, "Mustahik tidak ditemukan", 404);
    }

    return successResponse(
      res,
      "Detail mustahik berhasil diambil",
      { mustahik },
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateMustahik = async (req, res) => {
  try {
    const { id } = req.params;

    const mustahikExists = await prisma.mustahik.findUnique({
      where: { id },
    });

    if (!mustahikExists) {
      return errorResponse(res, "Mustahik tidak ditemukan", 404);
    }

    const mustahik = await prisma.mustahik.update({
      where: { id },
      data: {
        ...req.body,
        tanggalLahir: req.body.tanggalLahir
          ? new Date(req.body.tanggalLahir)
          : undefined,
      },
    });

    return successResponse(
      res,
      "Data mustahik berhasil diperbarui",
      { mustahik },
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteMustahik = async (req, res) => {
  try {
    const { id } = req.params;

    const mustahikExists = await prisma.mustahik.findUnique({
      where: { id },
    });

    if (!mustahikExists) {
      return errorResponse(res, "Mustahik tidak ditemukan", 404);
    }

    await prisma.mustahik.delete({
      where: { id },
    });

    return successResponse(res, "Mustahik berhasil dihapus", null, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export {
  createMustahik,
  getAllMustahik,
  getMustahikById,
  updateMustahik,
  deleteMustahik,
};
