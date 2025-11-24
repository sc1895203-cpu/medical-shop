console.log("file started");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Priyanka@7880",
  database: "shubham",
  port:3306,
//authPlugins: {
   // mysql_clear_password: () => Buffer.from("YOUR_PASSWORD" + "\0"),
 // }
});


db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Database connected successfully");
  }
});

// Search API
app.get("/search", (req, res) => {
  const q = req.query.q;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, [`%${q}%`], (err, result) => {
    if (err) return res.json({ error: err });
    return res.json(result);
  });
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    return res.json(result);
  });
});

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/order", (req, res) => {
  const { product, price, name, phone, address } = req.body;

  console.log("New Order:", req.body);

  const ownerNumber = "917898089538"; // WITHOUT + sign (CallMeBot requirement)
  const msg =
    'New Order Received!\n' +
    'Product: ${product}\nPrice: ₹${price}\nName: ${name}\nPhone: ${phone}\nAddress: ${address}';

  const url = `https://api.callmebot.com/whatsapp.php?phone=${ownerNumber}&text=${encodeURIComponent(
    msg
  )}&apikey=219645`;

  fetch(url)
    .then(() => {
      res.send("Order Placed! Owner has been notified on WhatsApp.");
    })
    .catch((err) => {
      console.log(err);
      res.send("Order saved but failed to send WhatsApp message.");
    });
});