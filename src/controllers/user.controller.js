const { constants: http } = require("http2");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const { User, Profile } = require("../models");
const { hashPassword } = require("../utils/password");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.detailUser = async function (req, res) {
  const { id } = req.params;
  const user = await User.findByPk(parseInt(id));
  if (!user) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak ditemukan",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "Detail user",
    results: {
      id: user.id,
      username: user.username,
      email: user.email,
      picture: user.picture,
    },
  });
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.listAllUsers = async function (req, res) {
  const users = await User.findAll();
  if (!users) {
    return res.status(http.HTTP_STATUS_NOT_FOUND).json({
      success: false,
      message: "Data user tidak ditemukan",
    });
  }

  res.status(http.HTTP_STATUS_OK).json({
    success: true,
    message: "List all user",
    result: users,
  });
};

/**
 *
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

exports.createUser = async function (req, res) {
  const { email, password, roles, fullname, phone } = req.body;

  if (!email || !password) {
    return res.status(http.HTTP_STATUS_BAD_REQUEST).json({
      success: false,
      message: "Email dan password wajib diisi",
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

    const image_url = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : null;

    const profile = await Profile.create({
      fullname,
      phone,
      image_url,
    });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      roles: roles || "user",
      profile_id: profile.id,
    });

    return res.status(http.HTTP_STATUS_CREATED).json({
      success: true,
      message: "User berhasil dibuat",
      result: {
        id: newUser.id,
        email: newUser.email,
        roles: newUser.roles,
        profile: {
          id: profile.id,
          fullname: profile.fullname,
          phone: profile.phone,
          image_url: profile.image_url,
        },
      },
    });
  } catch (error) {
    return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Gagal membuat user",
      error: error.message,
    });
  }
};
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.deleteUser = async function (req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(parseInt(id));
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Data user tidak tidak ditemukan",
      });
    }
    const deletedUser = await User.destroy({
      where: {
        id: parseInt(id),
      },
      returning: ["true"],
    });

    if (deletedUser === 0) {
      return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Gagal menghapus user",
      });
    }
    res.status(http.HTTP_STATUS_OK).json({
      success: true,
      message: "data user berhasil di hapus",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    return res.status(http.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Terjadi kesalahan server saat menghapus user.",
      error: error.message,
    });
  }
};

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

exports.updateUser = async function (req, res) {
  const { id } = req.params;
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
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(http.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const profile = await Profile.findByPk(user.profile_id);

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
        where: { id },
      });
    }

    if (Object.keys(profileNewData).length > 0) {
      await Profile.update(profileNewData, {
        where: { id: user.profile_id },
      });
    }

    const updatedUser = await User.findByPk(id, {
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
