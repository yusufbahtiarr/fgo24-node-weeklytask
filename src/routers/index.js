const routers = require("express").Router();

routers.use("/users", require("./user.router"));

module.exports = routers;
