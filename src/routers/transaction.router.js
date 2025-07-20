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
transactionRouter.get(
  "/booked_seats",
  verifyToken,
  transactionController.getBookedSeats
);
transactionRouter.post(
  "",
  verifyToken,
  transactionController.createTransaction
);

module.exports = transactionRouter;
