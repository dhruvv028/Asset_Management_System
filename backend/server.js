const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "28@Dgupta",
  database: "asset_registry"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
    return;
  }

  console.log("Database connected successfully");
});

app.get("/", (req, res) => {
  res.send("Asset Registry API Running");
});
// GET route ko create karenge
app.get("/employees", (req, res) => {
  const query = "SELECT * FROM employees";

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching employees");
    }
    res.json(results);
  });
});
//POST to insert values from code instead of manually from SQL
app.post("/employees", (req, res) => {
  const { name, email, department } = req.body;

  const query =
    "INSERT INTO employees (name, email, department) VALUES (?, ?, ?)";

  db.query(query, [name, email, department], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error adding employee");
    }

    res.json({
      message: "Employee added successfully",
      employeeId: result.insertId,
    });
  });
});
//DELETE will form route parameter to delete particular employee through id
app.delete("/employees/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM employees WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error deleting employee");
    }

    res.json({
      message: "Employee deleted successfully"
    });
  });
});
//UPDATE to update necessary information
app.put("/employees/:id", (req, res) => {
  const id = req.params.id;

  const { name, email, department } = req.body;

  const query =
    "UPDATE employees SET name = ?, email = ?, department = ? WHERE id = ?";

  db.query(
    query,
    [name, email, department, id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error updating employee");
      }

      res.json({
        message: "Employee updated successfully",
      });
    }
  );
});
//Employee registery will end here..
//Asset registery starts here..
//GET details of assets
app.get("/assets", (req, res) => {
  const query = `
    SELECT
      assets.id,
      assets.asset_name,
      assets.serial_number,
      assets.purchase_date,
      assets.status,
      employees.name AS employee_name
    FROM assets
    LEFT JOIN employees
    ON assets.employee_id = employees.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching assets");
    }

    res.json(results);
  });
});
// POST details of assets
app.post("/assets", (req, res) => {
  const {
    asset_name,
    serial_number,
    purchase_date,
    status,
    employee_id
  } = req.body;

  const query =
    "INSERT INTO assets (asset_name, serial_number, purchase_date, status, employee_id) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [asset_name, serial_number, purchase_date, status, employee_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error adding asset");
      }

      res.json({
        message: "Asset added successfully",
        assetId: result.insertId
      });
    }
  );
});
//UPDATE details of asset
app.put("/assets/:id", (req, res) => {
  const id = req.params.id;

  const {
    asset_name,
    serial_number,
    purchase_date,
    status,
    employee_id
  } = req.body;

  const query = `
    UPDATE assets
    SET
      asset_name = ?,
      serial_number = ?,
      purchase_date = ?,
      status = ?,
      employee_id = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      asset_name,
      serial_number,
      purchase_date,
      status,
      employee_id,
      id
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error updating asset");
      }

      res.json({
        message: "Asset updated successfully"
      });
    }
  );
});
//DELTE assets from employee matching his id
app.delete("/assets/:id", (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM assets WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error deleting asset");
    }

    res.json({
      message: "Asset deleted successfully"
    });
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});