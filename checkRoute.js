const { cloudDB, localDB } = require("./dbConfig");

const checkRouter = require("express").Router();

checkRouter.post("/", async (req, res) => {
  try {
    const { REF_VISITNO, PARAMCODE, PARAMNAME } = req.body;
    let obj = {
      REF_VISITNO,
      REQDATETIME: new Date(),
      PARAMCODE,
      PARAMNAME,
    };
    const result = await cloudDB("IMPL_I_TABLE").insert(obj).returning("*");
    return res.send({ message: "Success", data: result });
  } catch (error) {
    console.error("Error processing cloudDB table A:", error);
    res.send({ message: "error", error: error.message });
  }
});

checkRouter.get("/getRows", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const i_table_rows = await cloudDB("IMPL_I_TABLE").select("*");
    const impl_param_rows = await cloudDB("IMPL_PARAM").select("*");
    const impl_macid_rows = await localDB("IMPL_MACID").select("*");
    res.json({ i_table_rows, impl_param_rows, impl_macid_rows });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

checkRouter.get("/add_id_column", async function (req, res) {
  try {
    // Step 1: Add the id column with VARCHAR data type
    let data = await cloudDB.schema.alterTable("IMPL_PARAM", function (table) {
      table
        .uuid("ROW_ID")
        .notNullable()
        .defaultTo(cloudDB.raw("NEWID()"))
        .unique();
    });

    console.log("Id column added and populated successfully.");
    res.send({ msg: "Success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

checkRouter.get("/add_isSynced_column", async function (req, res) {
  try {
    let data = await cloudDB.schema.alterTable("IMPL_PARAM", function (table) {
      table.boolean("isSynced").notNullable().defaultTo(false);
    });
    res.send({ msg: "Success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

checkRouter.get("/get_isSynced_false", async function (req, res) {
  try {
    let data = await cloudDB("IMPL_I_TABLE")
      .select("*")
      .where("isSynced", false);
    res.send({ msg: "success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

checkRouter.get("/i_table_sync/:row_id", async function (req, res) {
  try {
    let { row_id } = req.params;
    let data = await cloudDB("IMPL_I_TABLE").where({ ROW_ID: row_id }).first();
    let isPresent = await localDB("IMPL_I_TABLE")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || data.isSynced === false) {
      let add2Local = await localDB("IMPL_I_TABLE")
        .insert({
          ...data,
          isSynced: true,
        })
        .returning("*");

      data = await cloudDB("IMPL_I_TABLE")
        .where({ ROW_ID: row_id })
        .update({ isSynced: true });

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

checkRouter.get("/impl_param_sync/:row_id", async function (req, res) {
  try {
    let { row_id } = req.params;
    let data = await cloudDB("IMPL_PARAM").where({ ROW_ID: row_id }).first();
    let isPresent = await localDB("IMPL_PARAM")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || data.isSynced === false) {
      let add2Local = await localDB("IMPL_PARAM")
        .insert({
          ...data,
          isSynced: true,
        })
        .returning("*");

      data = await cloudDB("IMPL_PARAM")
        .where({ ROW_ID: row_id })
        .update({ isSynced: true });

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

module.exports = checkRouter;
