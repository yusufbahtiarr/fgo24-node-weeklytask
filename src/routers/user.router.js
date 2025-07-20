const userRouter = require("express").Router();
const fs = require("fs");
const path = require("node:path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const uploadDir = path.join("uploads", "profiles");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("uploads", "profiles"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const savedFile = `${uuidv4()}${ext}`;
    cb(null, savedFile);
  },
});

const upload = multer({ storage });

userRouter.get("/profile", verifyToken, userController.getUserProfile);
userRouter.patch(
  "/profile",
  verifyToken,
  upload.single("picture"),
  userController.updateUserProfile
);

module.exports = userRouter;
