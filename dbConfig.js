require("dotenv").config();

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
    // server: process.env.CLOUD_SERVER,
    // user: process.env.CLOUD_USER,
    // password: process.env.CLOUD_PASSWORD,
    // database: process.env.CLOUD_DATABASE,
    server: "103.138.188.146",
    user: "sa",
    password: "oqRdes8mnRt3#D",
    database: "LISData",
  },
});

// const knex = require("knex")({
//   client: "oracledb",
//   connection: {
//     user: "",
//     password: "",
//     connectionString: "",
//   },
// });

module.exports = { localDB, cloudDB };
