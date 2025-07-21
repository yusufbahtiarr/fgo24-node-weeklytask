const adminRouter = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

adminRouter.get("/movies", verifyToken, isAdmin, adminController.getAllMovies);
adminRouter.post("/movies", verifyToken, isAdmin, adminController.createMovie);
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

module.exports = adminRouter;
