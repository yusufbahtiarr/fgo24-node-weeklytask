const routers = require("express").Router();

routers.use("/auth", require("./auth.router"));
routers.use("/users", require("./user.router"));

module.exports = routers;
