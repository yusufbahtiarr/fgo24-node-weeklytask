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
transactionRouter.get("/locations", transactionController.getAllLocations);
transactionRouter.get("/times", transactionController.getAllTimes);
transactionRouter.get("/cinemas", transactionController.getAllCinemas);
transactionRouter.get(
  "/payment-methods",
  verifyToken,
  transactionController.getAllPaymentMethods
);
transactionRouter.get(
  "/booked-seats",
  verifyToken,
  transactionController.getBookedSeats
);
transactionRouter.post(
  "",
  verifyToken,
  transactionController.createTransaction
);
transactionRouter.get(
  "/ticket-result",
  verifyToken,
  transactionController.getLastTransactionByUser
);

module.exports = transactionRouter;
