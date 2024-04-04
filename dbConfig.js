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
    server: "localhost",
    user: "sa",
    password: "Passw0rd",
    database: "Interface",
  },
});

const cloudDB = require("knex")({
  client: "mssql",
  connection: {
    server: "103.138.188.146",
    user: "sa",
    password: "oqRdes8mnRt3#D",
    database: "LISData",
    // server: "103.138.188.146",
    // user: "sa",
    // password: "oqRdes8mnRt3#D",
    // database: "LISData",
  },
});

module.exports = { localDB, cloudDB };
