const routers = require("express").Router();

routers.use("/auth", require("./auth.router"));
routers.use("/users", require("./user.router"));
routers.use("/transaction", require("./transaction.router"));

module.exports = routers;
