const { constants: http } = require("http2");
const { Movie, Cast, Genre, Director } = require("../models");
const { Op } = require("sequelize");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getAllMovies = async function (_req, res) {
  try {
    const movies = await Movie.findAll({
      include: [
        {
          model: Cast,
          as: "casts",
          attributes: ["cast_name"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["genre_name"],
          through: { attributes: [] },
        },
        {
          model: Director,
          as: "directors",
          attributes: ["director_name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!movies || movies.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada data film ditemukan",
      });
    }

    console.log("Raw movies data:", JSON.stringify(movies, null, 2));

    const result = movies.map((movie) => ({
      id: movie.id,
      poster_url: movie.poster_url,
      backdrop_url: movie.backdrop_url,
      title: movie.title,
      release_date: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,
      casts:
        movie.casts.length > 0
          ? movie.casts.map((cast) => cast.cast_name || "Unknown").join(", ")
          : "No casts",
      genres:
        movie.genres.length > 0
          ? movie.genres
              .map((genre) => genre.genre_name || "Unknown")
              .join(", ")
          : "No genres",
      directors:
        movie.directors.length > 0
          ? movie.directors
              .map((director) => director.director_name || "Unknown")
              .join(", ")
          : "No directors",
    }));

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data film berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(http.HTTP2_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data film",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.getMovieByID = async function (req, res) {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({
      where: { id: parseInt(id) },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Cast,
          as: "casts",
          attributes: ["cast_name"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["genre_name"],
          through: { attributes: [] },
        },
        {
          model: Director,
          as: "directors",
          attributes: ["director_name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Movie tidak ditemukan",
      });
    }

    const result = {
      id: movie.id,
      poster_url: movie.poster_url,
      backdrop_url: movie.backdrop_url,
      title: movie.title,
      release_date: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,
      casts:
        movie.casts.length > 0
          ? movie.casts.map((cast) => cast.cast_name || "Unknown").join(", ")
          : "No casts",
      genres:
        movie.genres.length > 0
          ? movie.genres
              .map((genre) => genre.genre_name || "Unknown")
              .join(", ")
          : "No genres",
      directors:
        movie.directors.length > 0
          ? movie.directors
              .map((director) => director.director_name || "Unknown")
              .join(", ")
          : "No directors",
    };

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data movie berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error("Error in getMovieByID:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data movie",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getUpcomingMovies = async function (_req, res) {
  try {
    const today = new Date();
    const movies = await Movie.findAll({
      where: {
        release_date: { [Op.gt]: today },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Cast,
          as: "casts",
          attributes: ["cast_name"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["genre_name"],
          through: { attributes: [] },
        },
        {
          model: Director,
          as: "directors",
          attributes: ["director_name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!movies || movies.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada movies mendatang ditemukan",
      });
    }

    const result = movies.map((movie) => ({
      id: movie.id,
      poster_url: movie.poster_url,
      backdrop_url: movie.backdrop_url,
      title: movie.title,
      release_date: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,
      casts:
        movie.casts.length > 0
          ? movie.casts.map((cast) => cast.cast_name || "Unknown").join(", ")
          : "No casts",
      genres:
        movie.genres.length > 0
          ? movie.genres
              .map((genre) => genre.genre_name || "Unknown")
              .join(", ")
          : "No genres",
      directors:
        movie.directors.length > 0
          ? movie.directors
              .map((director) => director.director_name || "Unknown")
              .join(", ")
          : "No directors",
    }));

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data movies mendatang berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error("Error in upcomingMovies:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data movies mendatang",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getNowShowingMovies = async function (_req, res) {
  try {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    const movies = await Movie.findAll({
      where: {
        release_date: {
          [Op.between]: [oneMonthAgo, today],
        },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Cast,
          as: "casts",
          attributes: ["cast_name"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["genre_name"],
          through: { attributes: [] },
        },
        {
          model: Director,
          as: "directors",
          attributes: ["director_name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!movies || movies.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada movie yang sedang tayang ditemukan saat ini.",
      });
    }

    const result = movies.map((movie) => ({
      id: movie.id,
      poster_url: movie.poster_url,
      backdrop_url: movie.backdrop_url,
      title: movie.title,
      release_date: movie.release_date,
      runtime: movie.runtime,
      overview: movie.overview,
      casts:
        movie.casts.length > 0
          ? movie.casts.map((cast) => cast.cast_name || "Unknown").join(", ")
          : "No casts",
      genres:
        movie.genres.length > 0
          ? movie.genres
              .map((genre) => genre.genre_name || "Unknown")
              .join(", ")
          : "No genres",
      directors:
        movie.directors.length > 0
          ? movie.directors
              .map((director) => director.director_name || "Unknown")
              .join(", ")
          : "No directors",
    }));

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data movies yang sedang tayang berhasil diambil",
      data: result,
    });
  } catch (error) {
    console.error("Error in nowShowingMovies:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data movies mendatang",
      error: error.message,
    });
  }
};
