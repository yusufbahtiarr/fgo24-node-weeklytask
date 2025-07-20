const { constants: http } = require("http2");
const { hashPassword } = require("../utils/password");
// const { saveOTP, verifyOTP } = require("../db/old/auth.model");
const { User, Profile } = require("../models");
const { verifyPassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email dan password wajib diisi",
    });
  }

  try {
    const user = await User.findOne({
      where: { email },
      include: {
        model: Profile,
        as: "profile",
      },
    });

    if (!user) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const isValid = await verifyPassword(user.password, password);
    if (!isValid) {
      return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
        success: false,
        message: "Email atau password salah",
      });
    }

    const payload = {
      userId: user.id,
      role: user.roles,
      email: user.email,
    };

    const token = generateToken(payload);

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Login berhasil",
      results: {
        token,
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
      },
    });
  } catch (error) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan saat login",
      error: error.message,
    });
  }
};

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.register = async function (req, res) {
  const { email, password, confirm_password } = req.body;

  if (!email || !password || !confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email, password, dan konfirmasi password wajib diisi",
    });
  }

  if (password !== confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Konfirmasi password tidak sesuai",
    });
  }

  try {
    const existsUser = await User.findOne({ where: { email } });

    if (existsUser) {
      return res.status(http.HTTP_STATUS_CONFLICT).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const profile = await Profile.create({});

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      roles: "user",
      profile_id: profile.id,
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "User berhasil dibuat",
      result: {
        id: newUser.id,
        email: newUser.email,
        roles: newUser.roles,
        profile_id: profile.id,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal membuat user",
      error: error.message,
    });
  }
};

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.forgotPassword = function (req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email tidak boleh kosong",
    });
  }
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Email tidak terdaftar",
    });
  }

  const otpUser = saveOTP(user.id);
  if (!otpUser) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal melakukan forgot password",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message:
      "Berhasil melakukan forgot password. Gunakan otp ini untuk melakukan reset password",
    data: "OTP: " + otpUser.otp,
  });
};

exports.resetPassword = function (req, res) {
  const { otp, new_password, confirm_password } = req.body;
  if (!otp && !new_password && !confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Otp, new password dan confirm password tidak boleh kosong",
    });
  }
  if (new_password !== confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "new password dan confirm password tidak sama",
    });
  }
  const userId = verifyOTP(otp);
  if (!userId) {
    res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "OTP tidak valid",
    });
  }

  const user = updatePassword(userId, new_password);
  if (!user) {
    res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal melakukan reset password",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Reset password berhasil",
  });
};
