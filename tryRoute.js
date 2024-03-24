const { localDB, cloudDB } = require("./dbConfig");

const tryRouter = require("express").Router();

tryRouter.post("/", async (req, res) => {
  try {
    const obj = req.body;
    let data = await localDB("IMPL_MACID").insert(obj).returning("*");

    return res.send({ msg: "Success", data });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

tryRouter.get("/change_isSynced_status", async (req, res) => {
  try {
    let data = await cloudDB("IMPL_PARAM")
      .where("isSynced", true)
      .update({ isSynced: false });
    // const impl_macid_rows = await localDB("IMPL_MACID").select("*");
    // const impl_machineparam_rows = await localDB("IMPL_MACHINEPARAM").select(
    //   "*"
    // );
    // const impl_sampledata_rows = await localDB("IMPL_SAMPLEDATA").select("*");
    res.json(data);
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

tryRouter.get("/add_id_column", async function (req, res) {
  try {
    // Step 1: Add the id column with VARCHAR data type
    let data = await localDB.schema.alterTable(
      "IMPL_SAMPLEDATA",
      function (table) {
        table
          .uuid("ROW_ID")
          .notNullable()
          .defaultTo(cloudDB.raw("NEWID()"))
          .unique();
      }
    );

    console.log("Id column added and populated successfully.");
    res.send({ msg: "Success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

tryRouter.get("/add_isSynced_column", async function (req, res) {
  try {
    let data = await localDB.schema.alterTable(
      "IMPL_SAMPLEDATA",
      function (table) {
        table.boolean("isSynced").notNullable().defaultTo(false);
      }
    );
    res.send({ msg: "Success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

tryRouter.get("/get_isSynced_false", async function (req, res) {
  try {
    let data = await localDB("IMPL_MACHINEPARAM")
      .select("*")
      .where("isSynced", false);
    res.send({ msg: "success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

tryRouter.get("/impl_macid_sync/:row_id", async function (req, res) {
  try {
    let { row_id } = req.params;
    let data = await localDB("IMPL_MACID").where({ ROW_ID: row_id }).first();
    let isPresent = await cloudDB("IMPL_MACID")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || data.isSynced === false) {
      let add2Local = await cloudDB("IMPL_MACID")
        .insert({
          ...data,
          isSynced: true,
        })
        .returning("*");

      data = await localDB("IMPL_MACID")
        .where({ ROW_ID: row_id })
        .update({ isSynced: true })
        .returning("*");

      return res.send({ msg: "Success", data, add2Local });
    }

    return res.send({ msg: "All data up to date", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

tryRouter.get("/impl_machineparam_sync/:row_id", async function (req, res) {
  try {
    let { row_id } = req.params;
    let data = await localDB("IMPL_MACHINEPARAM")
      .where({ ROW_ID: row_id })
      .first();
    let isPresent = await cloudDB("IMPL_MACHINEPARAM")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || data.isSynced === false) {
      let add2Local = await cloudDB("IMPL_MACHINEPARAM")
        .insert({
          ...data,
          isSynced: true,
        })
        .returning("*");

      data = await localDB("IMPL_MACHINEPARAM")
        .where({ ROW_ID: row_id })
        .update({ isSynced: true })
        .returning("*");

      return res.send({ msg: "Success", data, add2Local });
    }

    return res.send({ msg: "All data up to date", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

tryRouter.get("/impl_sampledata_sync/:row_id", async function (req, res) {
  try {
    let { row_id } = req.params;
    let data = await localDB("IMPL_SAMPLEDATA")
      .where({ ROW_ID: row_id })
      .first();
    let isPresent = await cloudDB("IMPL_SAMPLEDATA")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || data.isSynced === false) {
      let add2Local = await cloudDB("IMPL_SAMPLEDATA")
        .insert({
          ...data,
          isSynced: true,
        })
        .returning("*");

      data = await localDB("IMPL_SAMPLEDATA")
        .where({ ROW_ID: row_id })
        .update({ isSynced: true })
        .returning("*");

      return res.send({ msg: "Success", data, add2Local });
    }

    return res.send({ msg: "All data up to date", data });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

module.exports = tryRouter;
