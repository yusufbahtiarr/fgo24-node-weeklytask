const { constants: http } = require("http2");
const { Movie } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getAllMovies = async function (_req, res) {
  try {
    const movies = await Movie.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!movies || movies.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada data film ditemukan",
      });
    }

    result = res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data film berhasil diambil",
      data: movies,
    });
  } catch (error) {
    return res.status(http.HTTP2_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data film",
      error: error.message,
    });
  }
};
