const { constants: http } = require("http2");
const { Movie, Cast, Genre, Director } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getAllMovies = async function (_req, res) {
  try {
    const movies = await Movie.findAll({
      order: [["createdAt", "DESC"]],
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
        message: "Tidak ada data movie ditemukan",
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
      message: "Data movie berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(http.HTTP2_STATUS_INTERNAL_SERVER_ERROR).json({
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
exports.deleteMovie = async function (req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Parameter ID movie tidak ditemukan.",
      });
    }

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: `Movie dengan ID ${id} tidak ditemukan.`,
      });
    }

    await movie.destroy();
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: `Movie "${movie.title}" (ID: ${id}) berhasil dihapus.`,
    });
  } catch (error) {
    console.error("Error in deleteMovie:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mencoba menghapus movie.",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.createMovie = async function (req, res) {
  let newMovie;
  try {
    const {
      title,
      poster_url,
      backdrop_url,
      release_date,
      runtime,
      overview,
      rating,
      casts,
      genres,
      directors,
    } = req.body;

    if (
      !title ||
      !release_date ||
      !runtime ||
      !overview ||
      !rating ||
      !poster_url ||
      !backdrop_url
    ) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message:
          "Judul, poster, backdrop, tanggal rilis, durasi, dan overview movie wajib diisi.",
      });
    }

    const newMovie = await Movie.create({
      title,
      poster_url,
      backdrop_url,
      release_date,
      runtime,
      overview,
      rating,
    });

    if (!newMovie) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Gagal membuat entri movie baru.",
      });
    }

    const associationPromises = [];

    if (casts && Array.isArray(casts) && casts.length > 0) {
      const existingCasts = await Cast.findAll({ where: { id: casts } });
      if (existingCasts.length !== casts.length) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Beberapa ID cast yang diberikan tidak valid.",
        });
      }
      associationPromises.push(newMovie.setCasts(casts));
    }

    if (genres && Array.isArray(genres) && genres.length > 0) {
      const existingGenres = await Genre.findAll({ where: { id: genres } });
      if (existingGenres.length !== genres.length) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Beberapa ID genre yang diberikan tidak valid.",
        });
      }
      associationPromises.push(newMovie.setGenres(genres));
    }

    if (directors && Array.isArray(directors) && directors.length > 0) {
      const existingDirectors = await Director.findAll({
        where: { id: directors },
      });
      if (existingDirectors.length !== directors.length) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Beberapa ID director yang diberikan tidak valid.",
        });
      }
      associationPromises.push(newMovie.setDirectors(directors));
    }

    await Promise.all(associationPromises);

    const fullMovie = await Movie.findByPk(newMovie.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Cast,
          as: "casts",
          attributes: ["id", "cast_name"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "genre_name"],
          through: { attributes: [] },
        },
        {
          model: Director,
          as: "directors",
          attributes: ["id", "director_name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!fullMovie) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          "Movie berhasil dibuat, namun gagal mengambil detail lengkapnya.",
      });
    }

    res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Movie berhasil ditambahkan!",
      data: {
        id: fullMovie.id,
        title: fullMovie.title,
        poster_url: fullMovie.poster_url,
        backdrop_url: fullMovie.backdrop_url,
        release_date: fullMovie.release_date,
        runtime: fullMovie.runtime,
        overview: fullMovie.overview,
        rating: fullMovie.rating,
        casts: fullMovie.casts.map((cast) => ({
          name: cast.cast_name,
        })),
        genres: fullMovie.genres.map((genre) => ({
          name: genre.genre_name,
        })),
        directors: fullMovie.directors.map((director) => ({
          name: director.director_name,
        })),
      },
    });
  } catch (error) {
    console.error("Error in createMovie:", error);
    if (newMovie && newMovie.id) {
      await newMovie
        .destroy()
        .catch((destroyErr) =>
          console.error("Failed to rollback movie creation:", destroyErr)
        );
    }
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mencoba menambahkan movie.",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.updateMovie = async function (req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      poster_url,
      backdrop_url,
      release_date,
      runtime,
      overview,
      rating,
      casts,
      genres,
      directors,
    } = req.body;

    if (!id) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "ID movie diperlukan untuk melakukan pembaruan.",
      });
    }

    const movie = await Movie.findByPk(id);

    if (!movie) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: `movie dengan ID ${id} tidak ditemukan.`,
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (poster_url) updateData.poster_url = poster_url;
    if (backdrop_url) updateData.backdrop_url = backdrop_url;
    if (release_date) updateData.release_date = release_date;
    if (runtime) updateData.runtime = runtime;
    if (overview) updateData.overview = overview;
    if (rating) updateData.rating = rating;

    await movie.update(updateData);

    const associationPromises = [];

    if (casts !== undefined) {
      if (!Array.isArray(casts)) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Data 'casts' harus berupa array.",
        });
      }
      const existingCasts = await Cast.findAll({ where: { id: casts } });
      if (existingCasts.length !== casts.length) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Beberapa ID cast yang diberikan tidak valid.",
        });
      }
      associationPromises.push(movie.setCasts(casts));
    }

    if (genres !== undefined) {
      if (!Array.isArray(genres)) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Data 'genres' harus berupa array.",
        });
      }
      const existingGenres = await Genre.findAll({ where: { id: genres } });
      if (existingGenres.length !== genres.length) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Beberapa ID genre yang diberikan tidak valid.",
        });
      }
      associationPromises.push(movie.setGenres(genres));
    }

    if (directors !== undefined) {
      if (!Array.isArray(directors)) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Data 'directors' harus berupa array.",
        });
      }
      const existingDirectors = await Director.findAll({
        where: { id: directors },
      });
      if (existingDirectors.length !== directors.length) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Beberapa ID director yang diberikan tidak valid.",
        });
      }
      associationPromises.push(movie.setDirectors(directors));
    }

    await Promise.all(associationPromises);

    const updatedFullMovie = await Movie.findByPk(movie.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: Cast,
          as: "casts",
          attributes: ["id", "cast_name"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "genre_name"],
          through: { attributes: [] },
        },
        {
          model: Director,
          as: "directors",
          attributes: ["id", "director_name"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: `Movie "${updatedFullMovie.title}" (ID: ${id}) berhasil diperbarui!`,
      data: {
        id: updatedFullMovie.id,
        title: updatedFullMovie.title,
        poster_url: updatedFullMovie.poster_url,
        backdrop_url: updatedFullMovie.backdrop_url,
        release_date: updatedFullMovie.release_date,
        runtime: updatedFullMovie.runtime,
        overview: updatedFullMovie.overview,
        rating: updatedFullMovie.rating,
        casts: updatedFullMovie.casts.map((cast) => ({
          name: cast.cast_name,
        })),
        genres: updatedFullMovie.genres.map((genre) => ({
          name: genre.genre_name,
        })),
        directors: updatedFullMovie.directors.map((director) => ({
          name: director.director_name,
        })),
      },
    });
  } catch (error) {
    console.error("Error in updateMovie:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mencoba memperbarui movie.",
      error: error.message,
    });
  }
};
