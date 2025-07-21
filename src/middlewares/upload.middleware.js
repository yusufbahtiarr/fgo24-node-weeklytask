const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const movieStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir;
    if (file.fieldname === "poster_file") {
      uploadDir = path.join(__dirname, "../../uploads/posters");
    } else if (file.fieldname === "backdrop_file") {
      uploadDir = path.join(__dirname, "../../uploads/backdrops");
    } else {
      return cb(new Error("Invalid fieldname for file upload"), false);
    }

    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const savedFile = `${uuidv4()}${ext}`;
    cb(null, savedFile);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan!"), false);
  }
};

const uploadMovieImages = multer({
  storage: movieStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024,
  },
}).fields([
  { name: "poster_file", maxCount: 1 },
  { name: "backdrop_file", maxCount: 1 },
]);

module.exports = {
  uploadMovieImages,
};
