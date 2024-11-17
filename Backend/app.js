const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
// Middleware
app.use(cors());
app.use(express.json());
// MySQL database connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database");
});

app.post("/api/add-product", (req, res) => {
  const { name, price } = req.body;
  const insertProductQuery = "INSERT INTO products (name, price) VALUES (?, ?)";
  db.query(insertProductQuery, [name, price], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: "Product added successfully",
      productId: result.insertId,
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
