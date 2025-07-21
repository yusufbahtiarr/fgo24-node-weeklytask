const adminRouter = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

adminRouter.get("/movies", verifyToken, isAdmin, adminController.getAllMovies);
adminRouter.get(
  "/movies/:id",
  verifyToken,
  isAdmin,
  adminController.getMovieByID
);

module.exports = adminRouter;
