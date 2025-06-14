require("dotenv").config();
const express = require("express");
const sequilize = require("./db");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);
app.use(errorHandler);

const start = async () => {
  try {
    await sequilize.authenticate();
    console.log("Аунтефикация в базе прошла успешно");
    await sequilize.sync({ alter: true });
    console.log("СИнхронизация с базой прошла успешно");
    app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
  } catch (e) {
    console.error(`Ошибка при запуске сервера${e}`);
  }
};

start();
