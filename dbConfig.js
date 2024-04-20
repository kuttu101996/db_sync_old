require("dotenv").config();
// const CryptoJS = require("crypto-js");
// let en_en = "cuba-infotech";

// Decryption
// const localServerBytes = CryptoJS.AES.decrypt(process.env.LOCAL_SERVER, en_en);
// const localServer = localServerBytes.toString(CryptoJS.enc.Utf8);
// const localUserBytes = CryptoJS.AES.decrypt(process.env.LOCAL_USER, en_en);
// const localUser = localUserBytes.toString(CryptoJS.enc.Utf8);
// const localPassBytes = CryptoJS.AES.decrypt(process.env.LOCAL_PASSWORD, en_en);
// const localPass = localPassBytes.toString(CryptoJS.enc.Utf8);

const localDB = require("knex")({
  client: "mssql",
  connection: {
    server: process.env.LOCAL_SERVER,
    user: process.env.LOCAL_USER,
    password: process.env.LOCAL_PASSWORD,
    database: process.env.LOCAL_DATABASE,
  },
});

const cloudDB = require("knex")({
  client: "mssql",
  connection: {
    server: process.env.CLOUD_SERVER,
    user: process.env.CLOUD_USER,
    password: process.env.CLOUD_PASSWORD,
    database: process.env.CLOUD_DATABASE,
  },
});

module.exports = { localDB, cloudDB };
