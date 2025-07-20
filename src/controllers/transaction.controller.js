const { constants: http } = require("http2");
const {
  Transaction,
  Movie,
  Cinema,
  Time,
  Location,
  PaymentMethod,
} = require("../models");

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
