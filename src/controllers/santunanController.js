import {
  createSantunanService,
  getAllSantunanService,
  getSantunanByIdService,
  getSantunanSummaryService,
} from "../services/santunanService.js";

import { successResponse, errorResponse } from "../utils/response.js";

const createSantunan = async (req, res) => {
  try {
    const { nominal, program, jenisSantunan, mustahikId } = req.body;

    if (!nominal || !program || !jenisSantunan || !mustahikId) {
      return errorResponse(res, "Data santunan tidak lengkap", 400);
    }

    const userId = req.user.id;

    const ttdPenerima = req.files?.ttdPenerima?.[0]?.filename || null;
    const dokumentasi = req.files?.dokumentasi?.[0]?.filename || null;

    const payload = {
      nominal: parseInt(nominal) || 0,
      program,
      jenisSantunan,
      userId: userId,
      mustahikId: mustahikId,
      ttdPenerima,
      dokumentasi,
    };

    const santunan = await createSantunanService(payload);

    return successResponse(
      res,
      "Santunan berhasil ditambahkan",
      { santunan },
      201,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 500);
  }
};

const getAllSantunan = async (req, res) => {
  try {
    const { jenis, search } = req.query;

    if (!jenis) {
      return errorResponse(res, "Query parameter 'jenis' wajib diisi", 400);
    }

    const filter = {
      jenisSantunan: jenis,
    };

    if (search) {
      filter.OR = [
        {
          mustahik: {
            nama: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const santunan = await getAllSantunanService(filter);

    return successResponse(
      res,
      "Data santunan berhasil diambil",
      { santunan },
      200,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 500);
  }
};

const getSantunanById = async (req, res) => {
  try {
    const { id } = req.params;
    const santunan = await getSantunanByIdService(id);
    if (!santunan) return errorResponse(res, "Santunan tidak ditemukan", 404);

    return successResponse(
      res,
      "Detail santunan berhasil diambil",
      { santunan },
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getSantunanSummary = async (req, res) => {
  try {
    const summary = await getSantunanSummaryService();

    return successResponse(
      res,
      "Ringkasan santunan berhasil diambil",
      summary,
      200,
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, error.message, 500);
  }
};

export { createSantunan, getAllSantunan, getSantunanById, getSantunanSummary };
