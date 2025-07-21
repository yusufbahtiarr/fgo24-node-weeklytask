const moviesRouter = require("express").Router();
const moviesController = require("../controllers/movies.controller");

moviesRouter.get("", moviesController.getAllMovies);
moviesRouter.get("/upcoming", moviesController.getUpcomingMovies);
moviesRouter.get("/now-showing", moviesController.getNowShowingMovies);
moviesRouter.get("/genres", moviesController.getAllGenres);
moviesRouter.get("/casts", moviesController.getAllCasts);
moviesRouter.get("/directors", moviesController.getAllDirectors);
moviesRouter.get("/:id", moviesController.getMovieByID);

module.exports = moviesRouter;
