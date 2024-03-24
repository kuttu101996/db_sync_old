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

// Get Rows
checkRouter.get("/getRows/I_Table", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const i_table_rows = await cloudDB("IMPL_I_TABLE").select("*");
    res.json({ msg: "Success", data: i_table_rows });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

checkRouter.get("/getRows/Impl_Param", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const impl_param_rows = await cloudDB("IMPL_PARAM").select("*");
    // .where({ isSynced: false });
    res.json({ msg: "Success", data: impl_param_rows });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

checkRouter.get("/getRows/Impl_MacID", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const impl_macid_rows = await localDB("IMPL_MACID").select("*");
    // .where({ isSynced: false });
    res.json({ msg: "Success", data: impl_macid_rows });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

checkRouter.get("/getRows/Impl_MachineParam", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const impl_machineparam_rows = await localDB("IMPL_MACHINEPARAM").select(
      "*"
    );
    // .where({ isSynced: false });
    res.json({ msg: "Success", data: impl_machineparam_rows });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

checkRouter.get("/getRows/Impl_SampleData", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const impl_sampledata_rows = await localDB("IMPL_SAMPLEDATA").select("*");
    // .where({ isSynced: false });
    res.json({ msg: "Success", data: impl_sampledata_rows });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add Column
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

// Check isSync Status
checkRouter.get("/get_isSynced_false", async function (req, res) {
  try {
    let data = await cloudDB("IMPL_PARAM")
      // .select("*")
      .where("isSynced", true)
      .update({ isSynced: false })
      .returning("*");
    res.send({ msg: "success", data });
  } catch (error) {
    console.error("Error:", error);
    res.send({ Error: error });
  }
});

// Sync db rows
checkRouter.get("/I_Table/:row_id", async function (req, res) {
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

    return res.send({ msg: "All data up to date", data, isPresent });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

checkRouter.get("/Impl_Param/:row_id", async function (req, res) {
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

checkRouter.get("/Impl_MacID/:row_id", async function (req, res) {
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

checkRouter.get("/Impl_MachineParam/:row_id", async function (req, res) {
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

checkRouter.get("/Impl_SampleData/:row_id", async function (req, res) {
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

module.exports = checkRouter;
