const { constants: http } = require("http2");

exports.isAdmin = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(http.HTTP_STATUS_FORBIDDEN).json({
      message: "Akses ditolak. Hanya admin yang diizinkan.",
    });
  }
  next();
};
