const { constants: http } = require("http2");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;
const { User, Profile } = require("../models");
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
 * @param { import("express").Request} req
 * @param { import("express").Response} res
 * @returns
 */

// /**
//  *
//  * @param {import("express").Request} req
//  * @param {import("express").Response} res
//  */

// exports.deleteUser = async function (req, res) {
//   const { id } = req.params;
//   try {
//     const user = await User.findByPk(parseInt(id));
//     if (!user) {
//       return res.status(http.HTTP_STATUS_NOT_FOUND).json({
//         success: false,
//         message: "Data user tidak tidak ditemukan",
//       });
//     }
//     const deletedUser = await User.destroy({
//       where: {
//         id: parseInt(id),
//       },
//       returning: ["true"],
//     });

//     if (deletedUser === 0) {
//       return res.status(http.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Gagal menghapus user",
//       });
//     }
//     res.status(http.HTTP_STATUS_OK).json({
//       success: true,
//       message: "data user berhasil di hapus",
//       data: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         picture: user.picture,
//       },
//     });
//   } catch (error) {
//     return res.status(http.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Terjadi kesalahan server saat menghapus user.",
//       error: error.message,
//     });
//   }
// };

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
