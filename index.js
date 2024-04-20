const express = require("express");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from server...");
});

app.use("/api", router);

app.listen(3333, () => {
  console.log(`Server at 3333`);
});
