const { constants: http } = require("http2");
const {
  Movie,
  Cast,
  Genre,
  Director,
  Time,
  Location,
  Cinema,
} = require("../models");
const fs = require("fs");
const path = require("path");

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
  let uploadedPosterPath = null;
  let uploadedBackdropPath = null;
  try {
    const {
      title,
      release_date,
      runtime,
      overview,
      rating,
      casts,
      genres,
      directors,
    } = req.body;

    const parsedCasts =
      typeof casts === "string" ? casts.split(",").map(Number) : [];
    const parsedGenres =
      typeof genres === "string" ? genres.split(",").map(Number) : [];
    const parsedDirectors =
      typeof directors === "string" ? directors.split(",").map(Number) : [];

    const isInvalidArray = (arr) =>
      !Array.isArray(arr) || arr.length === 0 || arr.some(isNaN);

    const posterFile =
      req.files && req.files["poster_file"]
        ? req.files["poster_file"][0]
        : null;
    const backdropFile =
      req.files && req.files["backdrop_file"]
        ? req.files["backdrop_file"][0]
        : null;

    if (!posterFile || !backdropFile) {
      if (posterFile) {
        fs.unlinkSync(posterFile.path);
      }
      if (backdropFile) {
        fs.unlinkSync(backdropFile.path);
      }
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Kedua file poster dan backdrop movie wajib diunggah!",
      });
    }

    uploadedPosterPath = posterFile.path;
    uploadedBackdropPath = backdropFile.path;

    if (
      !title ||
      !release_date ||
      !runtime ||
      !overview ||
      !rating ||
      !casts ||
      isInvalidArray(parsedCasts) ||
      isInvalidArray(parsedGenres) ||
      isInvalidArray(parsedDirectors)
    ) {
      if (uploadedPosterPath) fs.unlinkSync(uploadedPosterPath);
      if (uploadedBackdropPath) fs.unlinkSync(uploadedBackdropPath);
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message:
          "Judul, tanggal rilis, durasi, overview, rating, casts, genres, dan directors movie wajib diisi.",
      });
    }

    newMovie = await Movie.create({
      title,
      poster_url: posterFile.filename,
      backdrop_url: backdropFile.filename,
      release_date,
      runtime,
      overview,
      rating,
    });

    if (!newMovie) {
      if (uploadedPosterPath) fs.unlinkSync(uploadedPosterPath);
      if (uploadedBackdropPath) fs.unlinkSync(uploadedBackdropPath);
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Gagal membuat entri movie baru.",
      });
    }

    const associationPromises = [];

    const existingCasts = await Cast.findAll({ where: { id: parsedCasts } });
    if (existingCasts.length !== parsedCasts.length) {
      await newMovie.destroy();
      fs.unlinkSync(uploadedPosterPath);
      fs.unlinkSync(uploadedBackdropPath);
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Beberapa ID cast yang diberikan tidak valid.",
      });
    }
    associationPromises.push(newMovie.setCasts(parsedCasts));

    const existingGenres = await Genre.findAll({ where: { id: parsedGenres } });
    if (existingGenres.length !== parsedGenres.length) {
      await newMovie.destroy();
      fs.unlinkSync(uploadedPosterPath);
      fs.unlinkSync(uploadedBackdropPath);
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Beberapa ID genre yang diberikan tidak valid.",
      });
    }
    associationPromises.push(newMovie.setGenres(parsedGenres));

    const existingDirectors = await Director.findAll({
      where: { id: parsedDirectors },
    });
    if (existingDirectors.length !== parsedDirectors.length) {
      await newMovie.destroy();
      fs.unlinkSync(uploadedPosterPath);
      fs.unlinkSync(uploadedBackdropPath);
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Beberapa ID director yang diberikan tidak valid.",
      });
    }
    associationPromises.push(newMovie.setDirectors(parsedDirectors));

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
    if (uploadedPosterPath && fs.existsSync(uploadedPosterPath)) {
      try {
        fs.unlinkSync(uploadedPosterPath);
      } catch (unlinkErr) {
        console.error(
          "Gagal menghapus file poster yang diupload saat error:",
          unlinkErr
        );
      }
    }
    if (uploadedBackdropPath && fs.existsSync(uploadedBackdropPath)) {
      try {
        fs.unlinkSync(uploadedBackdropPath);
      } catch (unlinkErr) {
        console.error(
          "Gagal menghapus file backdrop yang diupload saat error:",
          unlinkErr
        );
      }
    }
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
    let {
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

    const posterFile = req.files?.poster_file?.[0];
    const backdropFile = req.files?.backdrop_file?.[0];
    const updateData = {};
    if (title) updateData.title = title;
    if (release_date) updateData.release_date = release_date;
    if (runtime) updateData.runtime = runtime;
    if (overview) updateData.overview = overview;
    if (rating) updateData.rating = rating;
    if (posterFile) {
      if (movie.poster_url) {
        const oldPosterPath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          "posters",
          movie.poster_url
        );
        if (fs.existsSync(oldPosterPath)) {
          fs.unlinkSync(oldPosterPath);
          console.log("Poster lama dihapus:", oldPosterPath);
        } else {
          console.log("Poster lama tidak ditemukan:", oldPosterPath);
        }
      }
      updateData.poster_url = posterFile.filename;
    }
    if (backdropFile) {
      if (movie.backdrop_url) {
        const oldBackdropPath = path.join(
          __dirname,
          "..",
          "..",
          "uploads",
          "backdrops",
          movie.backdrop_url
        );
        if (fs.existsSync(oldBackdropPath)) {
          fs.unlinkSync(oldBackdropPath);
          console.log("Backdrop lama dihapus:", oldBackdropPath);
        } else {
          console.log("Backdrop lama tidak ditemukan:", oldBackdropPath);
        }
      }
      updateData.backdrop_url = backdropFile.filename;
    }

    await movie.update(updateData);

    const associationPromises = [];

    if (casts !== undefined) {
      if (typeof casts === "string") {
        casts = casts.split(",").map((id) => parseInt(id));
      }

      if (!Array.isArray(casts)) {
        return res.status(400).json({
          success: false,
          message: "Data 'casts' harus berupa array.",
        });
      }

      const existingCasts = await Cast.findAll({ where: { id: casts } });
      if (existingCasts.length !== casts.length) {
        return res.status(400).json({
          success: false,
          message: "Beberapa ID cast yang diberikan tidak valid.",
        });
      }

      associationPromises.push(movie.setCasts(casts));
    }

    if (genres !== undefined) {
      if (typeof genres === "string") {
        genres = genres.split(",").map((id) => parseInt(id));
      }

      if (!Array.isArray(genres)) {
        return res.status(400).json({
          success: false,
          message: "Data 'genres' harus berupa array.",
        });
      }

      const existingGenres = await Genre.findAll({ where: { id: genres } });
      if (existingGenres.length !== genres.length) {
        return res.status(400).json({
          success: false,
          message: "Beberapa ID genre yang diberikan tidak valid.",
        });
      }

      associationPromises.push(movie.setGenres(genres));
    }

    if (directors !== undefined) {
      if (typeof directors === "string") {
        directors = directors.split(",").map((id) => parseInt(id));
      }

      if (!Array.isArray(directors)) {
        return res.status(400).json({
          success: false,
          message: "Data 'directors' harus berupa array.",
        });
      }

      const existingDirectors = await Director.findAll({
        where: { id: directors },
      });
      if (existingDirectors.length !== directors.length) {
        return res.status(400).json({
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.createTime = async function (req, res) {
  try {
    const { time } = req.body;

    if (!time) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Data time tidak boleh kosong.",
      });
    }

    const newTime = await Time.create({ time });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Waktu tayang berhasil ditambahkan.",
      data: newTime,
    });
  } catch (error) {
    console.error("Error in createTime:", error);
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat menambahkan waktu tayang.",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.createLocation = async function (req, res) {
  try {
    const { location } = req.body;

    if (!location) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Data location tidak boleh kosong.",
      });
    }

    const newLocation = await Location.create({ location });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Data lokasi berhasil ditambahkan.",
      data: newLocation,
    });
  } catch (error) {
    console.error("Error in createLocation:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat menambahkan data lokasi.",
      error: error.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.createCinema = async function (req, res) {
  try {
    const { cinema_name, image_url } = req.body;

    if (!cinema_name || !image_url) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Nama cinema dan image URL tidak boleh kosong.",
      });
    }

    const newCinema = await Cinema.create({
      cinema_name,
      image_url,
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "Cinema berhasil ditambahkan.",
      data: newCinema,
    });
  } catch (error) {
    console.error("Error in createCinema:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat menambahkan cinema.",
      error: error.message,
    });
  }
};
