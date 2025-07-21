const adminRouter = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");
const { uploadMovieImages } = require("../middlewares/upload.middleware");

adminRouter.get("/movies", verifyToken, isAdmin, adminController.getAllMovies);
adminRouter.post(
  "/movies",
  verifyToken,
  isAdmin,
  uploadMovieImages,
  adminController.createMovie
);
adminRouter.post("/times", verifyToken, isAdmin, adminController.createTime);
adminRouter.post(
  "/locations",
  verifyToken,
  isAdmin,
  adminController.createLocation
);
adminRouter.get(
  "/movies/:id",
  verifyToken,
  isAdmin,
  adminController.getMovieByID
);
adminRouter.delete(
  "/movies/:id",
  verifyToken,
  isAdmin,
  adminController.deleteMovie
);
adminRouter.patch(
  "/movies/:id",
  verifyToken,
  isAdmin,
  uploadMovieImages,
  adminController.updateMovie
);

module.exports = adminRouter;
