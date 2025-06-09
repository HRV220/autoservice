require("dotenv").config();
const express = require("express");
const sequilize = require("./db");
const PORT = process.env.PORT;

const app = express();

const start = async () => {
  try {
    await sequilize.authenticate();
    await sequilize.sync;
    app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));
  } catch (e) {
    console.log(`DB error ${e}`);
  }
};

start();
