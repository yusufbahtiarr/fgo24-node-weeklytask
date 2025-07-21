const { constants: http } = require("http2");
const { hashPassword } = require("../utils/password");
const { User, Profile } = require("../models");
const { verifyPassword } = require("../utils/password");
const {
  generateToken,
  generateResetToken,
  verifyToken,
} = require("../utils/jwt");
const redisClient = require("../lib/redis");

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
      role: user.role,
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

exports.forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
        success: false,
        message: "Email tidak boleh kosong.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Email tidak terdaftar.",
      });
    }

    const resetToken = generateResetToken({
      userId: user.id,
      email: user.email,
    });

    const redisKey = `reset_password:${resetToken}`;
    await redisClient.setEx(redisKey, 600, String(user.id));

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Token reset password berhasil dibuat.",
      data: {
        token: resetToken,
      },
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan saat proses forgot password.",
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

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;
  console.log("Token dari params:", req.params.token);

  if (!token) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Token tidak ada.",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Token tidak valid atau telah kadaluarsa.",
    });
  }

  const userId = decoded.userId;

  const tokenKey = `reset_password:${token}`;
  const exists = await redisClient.exists(tokenKey);
  if (!exists) {
    return res.status(http.HTTP_STATUS_UNAUTHORIZED).json({
      success: false,
      message: "Token reset password tidak ditemukan atau sudah digunakan.",
    });
  }

  if (!password || !confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Password dan konfirmasi password wajib diisi",
    });
  }

  if (password !== confirm_password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Password dan konfirmasi tidak cocok",
    });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Pengguna tidak ditemukan.",
      });
    }

    const hashed = await hashPassword(password);

    await User.update({ password: hashed }, { where: { id: userId } });

    await redisClient.del(tokenKey);

    return res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "Password berhasil diperbarui",
    });
  } catch (err) {
    console.error("Reset Password Error:", err);
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan saat mereset password",
    });
  }
};
