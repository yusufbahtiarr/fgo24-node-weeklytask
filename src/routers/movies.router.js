const moviesRouter = require("express").Router();
const moviesController = require("../controllers/movies.controller");

moviesRouter.get("", moviesController.getAllMovies);
moviesRouter.get("/upcoming", moviesController.getUpcomingMovies);
moviesRouter.get("/:id", moviesController.getMovieByID);

module.exports = moviesRouter;
