const express = require("express");
require("dotenv").config();
const cors = require("cors");
const checkRouter = require("./checkRoute");

const CryptoJS = require("crypto-js");

// Text to be encrypted
// const originalText = "Passw0rd";

// Encryption key (you should use a strong and secure key)
// const encryptionKey = "cuba-infotech";

// Encrypt the text
// const encryptedText = CryptoJS.AES.encrypt(
//   originalText,
//   encryptionKey
// ).toString();

// console.log("Encrypted text:", encryptedText);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from server...");
});

app.use("/api", checkRouter);

app.listen(3333, () => {
  console.log(`Server at 3333`);
});
