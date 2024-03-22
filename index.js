const express = require("express");
require("dotenv").config();
const cors = require("cors");
const checkRouter = require("./checkRoute");
const tryRouter = require("./tryRoute");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", checkRouter);
app.use("/try", tryRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server at ${process.env.PORT}`);
});
