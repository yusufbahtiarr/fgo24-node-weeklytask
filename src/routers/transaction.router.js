const transactionRouter = require("express").Router();
const transactionController = require("../controllers/transaction.controller");

const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

transactionRouter.get(
  "/all-transaction",
  verifyToken,
  isAdmin,
  transactionController.getAllTransaction
);

module.exports = transactionRouter;
