const { constants: http } = require("http2");
const {
  Transaction,
  Movie,
  Cinema,
  Time,
  Location,
  PaymentMethod,
  TransactionDetail,
} = require("../models");
const { Op } = require("sequelize");

exports.getAllTransaction = async function (req, res) {
  try {
    const transactions = await Transaction.findAll({
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Movie,
          as: "movie",
          attributes: ["title"],
        },
        {
          model: Cinema,
          as: "cinema",
          attributes: ["cinema_name"],
        },
        {
          model: Time,
          as: "time",
          attributes: ["time"],
        },
        {
          model: Location,
          as: "location",
          attributes: ["location"],
        },
        {
          model: PaymentMethod,
          as: "payment_method",
          attributes: ["payment_method"],
        },
      ],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Belum ada transaksi yang tercatat",
      });
    }

    const results = transactions.map((trx) => ({
      transaction_id: trx.id,
      name: trx.name,
      email: trx.email,
      phone: trx.phone,
      total_amount: trx.total_amount,
      movie_date: trx.movie_date,
      movie: trx.movie?.title,
      cinema: trx.cinema?.cinema_name,
      time: trx.time?.time,
      location: trx.location?.location,
      payment_method: trx.payment_method?.payment_method,
    }));

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil mengambil semua data transaksi",
      results,
    });
  } catch (err) {
    console.error("Error getAllTransaction:", err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil semua transaksi",
    });
  }
};

exports.getBookedSeats = async function (req, res) {
  const { movie_id, movie_date, cinema, time, location } = req.query;

  if (!movie_id || !movie_date || !cinema || !time || !location) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message:
        "Parameter movie_id, movie_date, cinema_id, time_id, dan location_id wajib diisi",
    });
  }

  try {
    const startOfDay = new Date(movie_date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(movie_date);
    endOfDay.setHours(23, 59, 59, 999);

    const seats = await TransactionDetail.findAll({
      attributes: ["seat"],
      include: [
        {
          model: Transaction,
          as: "transaction",
          attributes: [],
          where: {
            movie_id: Number(movie_id),
            movie_date: {
              [Op.between]: [startOfDay, endOfDay],
            },
            cinema_id: Number(cinema),
            time_id: Number(time),
            location_id: Number(location),
          },
        },
      ],
    });

    const seatResults = seats.map((s) => s.seat);

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil mengambil daftar kursi yang sudah dipesan",
      results: seatResults,
    });
  } catch (error) {
    console.error("Error getBookedSeats:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};

exports.createTransaction = async function (req, res) {
  try {
    const userId = req.userId;
    const {
      name,
      email,
      phone,
      total_amount,
      movie_date,
      cinema_id,
      location_id,
      movie_id,
      payment_method_id,
      time_id,
      seats,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !total_amount ||
      !movie_date ||
      !cinema_id ||
      !location_id ||
      !movie_id ||
      !payment_method_id ||
      !time_id ||
      !seats ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Semua data harus diisi!",
      });
    }

    const startOfDay = new Date(movie_date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(movie_date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingBookedSeats = await TransactionDetail.findAll({
      attributes: ["seat"],
      include: [
        {
          model: Transaction,
          as: "transaction",
          attributes: [],
          where: {
            movie_id: movie_id,
            movie_date: {
              [Op.between]: [startOfDay, endOfDay],
            },
            cinema_id: cinema_id,
            time_id: time_id,
            location_id: location_id,
          },
        },
      ],
      where: {
        seat: {
          [Op.in]: seats,
        },
      },
    });

    if (existingBookedSeats.length > 0) {
      const alreadyBookedSeats = existingBookedSeats.map((s) => s.seat);
      return res.status(http.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: `Beberapa kursi yang Anda pilih sudah dipesan: ${alreadyBookedSeats.join(
          ", "
        )}.`,
        booked_seats: alreadyBookedSeats,
      });
    }

    let transactionResult;
    try {
      transactionResult = await Transaction.create({
        user_id: userId,
        name: name,
        email: email,
        phone: phone,
        total_amount: total_amount,
        movie_date: movie_date,
        cinema_id: cinema_id,
        location_id: location_id,
        movie_id: movie_id,
        payment_method_id: payment_method_id,
        time_id: time_id,
      });

      if (!transactionResult) {
        return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
          success: false,
          message: "Gagal saat melakukan pemesanan tiket.",
        });
      }

      const seatDetail = seats.map((seat) => {
        return TransactionDetail.create({
          seat: seat,
          transaction_id: transactionResult.id,
        });
      });

      await Promise.all(seatDetail);

      const fullTransaction = await Transaction.findOne({
        where: { id: transactionResult.id },
        include: [
          {
            model: Movie,
            as: "movie",
            attributes: ["title"],
          },
          {
            model: Cinema,
            as: "cinema",
            attributes: ["cinema_name"],
          },
          {
            model: Time,
            as: "time",
            attributes: ["time"],
          },
          {
            model: Location,
            as: "location",
            attributes: ["location"],
          },
          {
            model: PaymentMethod,
            as: "payment_method",
            attributes: ["payment_method"],
          },
          {
            model: TransactionDetail,
            as: "transaction_detail",
            attributes: ["seat"],
          },
        ],
      });

      return res.status(http.HTTP_STATUS_CREATED).json({
        success: true,
        message: "Transaksi berhasil dibuat!",
        data: {
          id: fullTransaction.id,
          name: fullTransaction.name,
          email: fullTransaction.email,
          phone: fullTransaction.phone,
          total_amount: fullTransaction.total_amount,
          movie_date: fullTransaction.movie_date,
          title: fullTransaction.movie?.title,
          location: fullTransaction.location?.location,
          time: fullTransaction.time?.time,
          cinema: fullTransaction.cinema?.cinema_name,
          payment_method: fullTransaction.payment_method?.payment_method,
          seats: fullTransaction.transaction_detail?.map((s) => s.seat),
        },
      });
    } catch (err) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Transaksi gagal. Silakan coba lagi.",
        errors: err.message,
      });
    }
  } catch (err) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan saat memproses permintaan.",
      errors: err.message,
    });
  }
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getAllPaymentMethods = async function (_req, res) {
  try {
    const paymentMethods = await PaymentMethod.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!paymentMethods || paymentMethods.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada metode pembayaran ditemukan.",
      });
    }

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data metode pembayaran berhasil diambil.",
      data: paymentMethods,
    });
  } catch (error) {
    console.error("Error in getAllPaymentMethods:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        "Terjadi kesalahan server saat mengambil data metode pembayaran.",
      error: error.message,
    });
  }
};

exports.getAllLocations = async function (_req, res) {
  try {
    const locations = await Location.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!locations || locations.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada lokasi ditemukan.",
      });
    }

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data lokasi berhasil diambil.",
      data: locations,
    });
  } catch (error) {
    console.error("Error in getAllLocations:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data lokasi.",
      error: error.message,
    });
  }
};

exports.getAllTimes = async function (_req, res) {
  try {
    const times = await Time.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!times || times.length === 0) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Tidak ada jadwal waktu ditemukan.",
      });
    }

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Data jadwal waktu berhasil diambil.",
      data: times,
    });
  } catch (error) {
    console.error("Error in getAllTimes:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data jadwal waktu.",
      error: error.message,
    });
  }
};
