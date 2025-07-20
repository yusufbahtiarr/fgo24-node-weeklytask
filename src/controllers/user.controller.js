const { constants: http } = require("http2");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const {
  Transaction,
  Movie,
  Cinema,
  Time,
  Location,
  PaymentMethod,
} = require("../models");

const { hashPassword } = require("../utils/password");
const jwt = require("jsonwebtoken");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.getUserProfile = async function (req, res) {
  try {
    const userId = parseInt(req.userId);

    const user = await User.findByPk(parseInt(userId));

    const profile = await Profile.findByPk(parseInt(user.profile_id));

    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Data user tidak ditemukan",
      });
    }

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Detail user",
      results: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullname: profile.fullname,
        phone: profile.phone,
        image_url: profile.image_url,
      },
    });
  } catch (err) {
    console.error("Error getUserProfile:", err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data profile.",
    });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.updateUserProfile = async function (req, res) {
  const userId = parseInt(req.userId);

  const picture = req.file;
  const { email, password, fullname, phone } = req.body;

  const userNewData = {};
  const profileNewData = {};

  if (email) userNewData.email = email;
  if (password) userNewData.password = await hashPassword(password);
  if (fullname) profileNewData.fullname = fullname;
  if (phone) profileNewData.phone = phone;
  if (picture) profileNewData.image_url = picture.filename;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }
    console.log("user", user);

    const profile = await Profile.findByPk(user.profile_id);
    console.log("profile", profile);
    if (!profile) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Profile tidak ditemukan",
      });
    }

    if (picture && profile.image_url) {
      const oldPath = path.join("uploads", "profiles", profile.image_url);
      try {
        await fsPromises.unlink(oldPath);
      } catch (err) {
        console.warn("Gagal hapus gambar lama:", err.message);
      }
    }

    if (Object.keys(userNewData).length > 0) {
      await User.update(userNewData, {
        where: { id: userId },
      });
    }

    if (Object.keys(profileNewData).length > 0) {
      await Profile.update(profileNewData, {
        where: { id: user.profile_id },
      });
    }

    const updatedUser = await User.findByPk(userId, {
      include: { model: Profile, as: "profile" },
      attributes: { exclude: ["password"] },
    });

    if (!updatedUser) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Gagal mengupdate data user",
      });
    }

    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "User berhasil diupdate",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error saat update user:", error);
    res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal update user",
      error: error.message,
    });
  }
};

exports.getTransactionHistory = async function (req, res) {
  try {
    const userId = parseInt(req.userId);

    const transactions = await Transaction.findAll({
      where: { user_id: userId },
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
        message: "Data riwayat transaksi tidak ditemukan",
      });
    }

    const result = transactions.map((trx) => ({
      id: trx.id,
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
      total_price: trx.total_price,
      created_at: trx.created_at,
    }));

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Berhasil mengambil riwayat transaksi pengguna",
      results: result,
    });
  } catch (err) {
    console.error("Terjadi kesalahan saat mengambil riwayat transaksi:", err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan pada server saat mengambil riwayat transaksi",
    });
  }
};
