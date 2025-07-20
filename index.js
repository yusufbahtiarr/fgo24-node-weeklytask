const express = require("express");
const { constants: http } = require("http2");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", require("./src/routers"));
app.get("/*spalt", (_req, res) => {
  return res.status(http.HTTP_STATUS_NOT_FOUND).json({
    success: false,
    message: "Not found",
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
