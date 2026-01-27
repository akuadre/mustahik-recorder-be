import {
  createMustahikService,
  getAllMustahikService,
  getMustahikByIdService,
  updateMustahikService,
  deleteMustahikService,
} from "../services/mustahikService.js";

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
      kota,
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
      !kota ||
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

    const payload = {
      nama,
      tempatLahir,
      tanggalLahir: new Date(tanggalLahir),
      profesi,
      asnaf,
      negara: negara || "Indonesia",
      provinsi,
      kota,
      kecamatan,
      kelurahan,
      rt,
      rw,
      alamat,
      fotoMustahik,
      ttdMustahik,
      dokumenLain,
    };

    const mustahik = await createMustahikService(payload);

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

    const mustahik = await getAllMustahikService(search);

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

    const mustahik = await getMustahikByIdService(id);

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

    const existing = await getMustahikByIdService(id);
    if (!existing) {
      return errorResponse(res, "Mustahik tidak ditemukan", 404);
    }

    const payload = {
      ...req.body,
      tanggalLahir: req.body.tanggalLahir
        ? new Date(req.body.tanggalLahir)
        : undefined,
    };

    const mustahik = await updateMustahikService(id, payload);

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

    const existing = await getMustahikByIdService(id);
    if (!existing) {
      return errorResponse(res, "Mustahik tidak ditemukan", 404);
    }

    await deleteMustahikService(id);

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
