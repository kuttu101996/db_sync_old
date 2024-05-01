const { cloudDB, localDB } = require("./dbConfig");

const router = require("express").Router();

// Sync db rows
router.post("/I_Table", async function (req, res) {
  try {
    // let { row_id } = req.params;
    // let data = await cloudDB("IMPL_I_TABLE").where({ ROW_ID: row_id }).first();
    const payload = req.body;
    let isPresent = await localDB("IMPL_I_TABLE")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || payload.isSynced === false) {
      let add2Local = await localDB("IMPL_I_TABLE")
        .insert({
          ...payload,
          isSynced: true,
        })
        .returning("*");

      let data = await cloudDB("IMPL_I_TABLE")
        .where({ ROW_ID: row_id })
        .update({ isSynced: true })
        .returning("*");

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

// router.get("/Impl_Param/:row_id", async function (req, res) {
//   try {
//     let { row_id } = req.params;
//     let data = await cloudDB("IMPL_PARAM").where({ ROW_ID: row_id }).first();
//     let isPresent = await localDB("IMPL_PARAM")
//       .where({ ROW_ID: row_id })
//       .first();

//     if (!isPresent || data.isSynced === false) {
//       let add2Local = await localDB("IMPL_PARAM")
//         .insert({
//           ...data,
//           isSynced: true,
//         })
//         .returning("*");

//       data = await cloudDB("IMPL_PARAM")
//         .where({ ROW_ID: row_id })
//         .update({ isSynced: true })
//         .returning("*");

//       return res.send({ msg: "Success", data, add2Local });
//     }

//     return res.send({ msg: "All data up to date", data });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({
//       msg: "An error occurred while updating the isSynced status.",
//       error,
//     });
//   }
// });

router.post("/Impl_MacID", async function (req, res) {
  try {
    // let { row_id } = req.params;
    // let data = await localDB("IMPL_MACID").where({ ROW_ID: row_id }).first();
    const payload = req.body;
    let isPresent = await cloudDB("IMPL_MACID")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || payload.isSynced === false) {
      let add2Local = await cloudDB("IMPL_MACID")
        .insert({
          ...payload,
          isSynced: true,
        })
        .returning("*");

      let data = await localDB("IMPL_MACID")
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

router.post("/Impl_MachineParam/:row_id", async function (req, res) {
  try {
    // let { row_id } = req.params;
    // let data = await localDB("IMPL_MACHINEPARAM")
    //   .where({ ROW_ID: row_id })
    //   .first();
    const payload = req.body;
    let isPresent = await cloudDB("IMPL_MACHINEPARAM")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || payload.isSynced === false) {
      let add2Local = await cloudDB("IMPL_MACHINEPARAM")
        .insert({
          ...payload,
          isSynced: true,
        })
        .returning("*");

      let data = await localDB("IMPL_MACHINEPARAM")
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

router.post("/Impl_SampleData/:row_id", async function (req, res) {
  try {
    // let { row_id } = req.params;
    // let data = await localDB("IMPL_SAMPLEDATA")
    //   .where({ ROW_ID: row_id })
    //   .first();
    const payload = req.body;
    let isPresent = await cloudDB("IMPL_SAMPLEDATA")
      .where({ ROW_ID: row_id })
      .first();

    if (!isPresent || payload.isSynced === false) {
      let add2Local = await cloudDB("IMPL_SAMPLEDATA")
        .insert({
          ...payload,
          isSynced: true,
        })
        .returning("*");

      let data = await localDB("IMPL_SAMPLEDATA")
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

// If Sync reverse required
router.delete("/I_Table/:row_id", async (req, res) => {
  try {
    const { row_id } = req.params;
    const localCheck = await localDB("IMPL_I_TABLE")
      .where({ ROW_ID: row_id })
      .first();

    const data = await cloudDB("IMPL_I_TABLE")
      .where({ ROW_ID: row_id })
      .update({ isSynced: false });

    if (!localCheck) {
      return res.send({
        msg: "Success",
        additional: "Data not presentin localDB",
        data,
      });
    }

    let deleting = await localDB("IMPL_I_TABLE")
      .where({ ROW_ID: row_id })
      .delete();

    return res.send({
      msg: "Success",
      additional: deleting,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

router.delete("/Impl_Param/:row_id", async (req, res) => {
  try {
    const { row_id } = req.params;
    const localCheck = await localDB("IMPL_PARAM")
      .where({ ROW_ID: row_id })
      .first();

    const data = await cloudDB("IMPL_PARAM")
      .where({ ROW_ID: row_id })
      .update({ isSynced: false });

    if (!localCheck) {
      return res.send({
        msg: "Success",
        additional: "Data not presentin localDB",
        data,
      });
    }

    let deleting = await localDB("IMPL_PARAM")
      .where({ ROW_ID: row_id })
      .delete();

    return res.send({
      msg: "Success",
      additional: deleting,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

router.delete("/Impl_MacID/:row_id", async (req, res) => {
  try {
    const { row_id } = req.params;
    const cloudCheck = await cloudDB("IMPL_MACID")
      .where({ ROW_ID: row_id })
      .first();

    const data = await localDB("IMPL_MACID")
      .where({ ROW_ID: row_id })
      .update({ isSynced: false });

    if (!cloudCheck) {
      return res.send({
        msg: "Success",
        additional: "Data not presentin localDB",
        data,
      });
    }

    let deleting = await cloudDB("IMPL_MACID")
      .where({ ROW_ID: row_id })
      .delete();

    return res.send({
      msg: "Success",
      additional: deleting,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

router.delete("/Impl_MachineParam/:row_id", async (req, res) => {
  try {
    const { row_id } = req.params;
    const cloudCheck = await cloudDB("IMPL_MACHINEPARAM")
      .where({ ROW_ID: row_id })
      .first();

    const data = await localDB("IMPL_MACHINEPARAM")
      .where({ ROW_ID: row_id })
      .update({ isSynced: false });

    if (!cloudCheck) {
      return res.send({
        msg: "Success",
        additional: "Data not presentin localDB",
        data,
      });
    }

    let deleting = await cloudDB("IMPL_MACHINEPARAM")
      .where({ ROW_ID: row_id })
      .delete();

    return res.send({
      msg: "Success",
      additional: deleting,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

router.delete("/Impl_SampleData/:row_id", async (req, res) => {
  try {
    const { row_id } = req.params;
    const cloudCheck = await cloudDB("IMPL_SAMPLEDATA")
      .where({ ROW_ID: row_id })
      .first();

    const data = await localDB("IMPL_SAMPLEDATA")
      .where({ ROW_ID: row_id })
      .update({ isSynced: false });

    if (!cloudCheck) {
      return res.send({
        msg: "Success",
        additional: "Data not presentin localDB",
        data,
      });
    }

    let deleting = await cloudDB("IMPL_SAMPLEDATA")
      .where({ ROW_ID: row_id })
      .delete();

    return res.send({
      msg: "Success",
      additional: deleting,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      msg: "An error occurred while updating the isSynced status.",
      error,
    });
  }
});

// If manual insertion required for any table
router.post("/", async (req, res) => {
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

// If adding new Column required in any table
router.get("/add_id_column", async function (req, res) {
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

router.get("/add_isSynced_column", async function (req, res) {
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
router.get("/get_isSynced_false", async function (req, res) {
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

// Get Rows
router.get("/getRows/I_Table", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const rowCount = await cloudDB("IMPL_I_TABLE").count("* as count");
    const i_table_rows = await cloudDB("IMPL_I_TABLE")
      .select("*")
      .where("isSynced", false);
    res.json({
      msg: "Success",
      data: i_table_rows,
      rowCount: rowCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getRows/Impl_Param", async (req, res) => {
  try {
    const cloudRowsCount = await cloudDB("IMPL_PARAM")
      .count("* as length")
      .first();
    const localRowsCount = await localDB("IMPL_PARAM")
      .count("* as length")
      .first();

    if (cloudRowsCount.length === localRowsCount.length) {
      console.log("up-2-date");
      res.status(200).json({ msg: "up-to-date" });
    }

    if (cloudRowsCount.length !== localRowsCount.length) {
      const deletion = await localDB("IMPL_PARAM").delete();

      const batchSize = 100; // Adjust batch size as needed
      const totalRows = parseInt(cloudRowsCount.length);
      const batches = Math.ceil(totalRows / batchSize);
      console.log(deletion, totalRows, batches);

      for (let i = 0; i < batches; i++) {
        const offset = i * batchSize;

        const cloudRows = await cloudDB.raw(`
            WITH cte AS (
              SELECT *, ROW_NUMBER() OVER (ORDER BY PARAMCODE) AS row_num
              FROM IMPL_PARAM
            )
            SELECT *
            FROM cte
            WHERE row_num > ${offset} AND row_num <= ${offset + batchSize}
        `);

        const cleanedCloudRows = cloudRows.map((row) => {
          const { row_num, ...cleanedRow } = row;
          return cleanedRow;
        });

        // const insertion = await localDB("IMPL_PARAM").insert(cleanedCloudRows);

        const insertion = await Promise.all(
          cleanedCloudRows.map(
            async (item) =>
              await localDB("IMPL_PARAM")
                .insert({ ...item })
                .returning("*")
          )
        );
        console.log(insertion);
      }

      if (insertion.length === totalRows) {
        return res.status(200).json({ msg: "Success" });
      } else {
        return res.status(500).json({ error: "Failed to insert all rows" });
      }
    }
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.get("/getRows/Impl_Param", async (req, res) => {
//   try {
//     const impl_param_cloud_rows = await cloudDB("IMPL_PARAM").select("*");
//     const impl_param_local_rows = await cloudDB("IMPL_PARAM").select("*");
//     if (impl_param_cloud_rows.length === impl_param_local_rows.length)
//       return res.status(200).json({ msg: "up-to-date" });

//     await localDB("IMPL_PARAM").delete();

//     const insertion = impl_param_cloud_rows.map(
//       async (item) =>
//         await localDB("IMPL_PARAM")
//           .insert({
//             ...item,
//           })
//           .returning("*")
//     );
//     res.json({
//       msg: "Success",
//       insertion_length: insertion.length,
//       impl_param_cloud_rows_length: impl_param_cloud_rows.length,
//     });
//   } catch (error) {
//     console.error("Error fetching rows:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.get("/getRows/Impl_MacID", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const rowCount = await cloudDB("IMPL_MACID").count("* as count");
    const impl_macid_rows = await localDB("IMPL_MACID")
      .select("*")
      .where({ isSynced: false });
    res.json({
      msg: "Success",
      data: impl_macid_rows,
      rowCount: rowCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getRows/Impl_MachineParam", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const rowCount = await cloudDB("IMPL_MACHINEPARAM").count("* as count");
    const impl_mp_rows = await localDB("IMPL_MACHINEPARAM")
      .select("*")
      .where({ isSynced: false });
    res.json({
      msg: "Success",
      data: impl_mp_rows,
      rowCount: rowCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getRows/Impl_SampleData", async (req, res) => {
  try {
    // let data = await cloudDB("IMPL_I_TABLE")
    //   .where("isSynced", true)
    //   .update({ isSynced: false });
    const rowCount = await cloudDB("IMPL_SAMPLEDATA").count("* as count");
    const impl_sampledata_rows = await localDB("IMPL_SAMPLEDATA")
      .select("*")
      .where({ isSynced: false });
    res.json({
      msg: "Success",
      data: impl_sampledata_rows,
      rowCount: rowCount[0].count,
    });
  } catch (error) {
    console.error("Error fetching rows:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
