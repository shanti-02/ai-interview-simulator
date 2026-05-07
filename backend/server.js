// backend/server.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const aiRoutes = require("./routes/aiRoutes");

app.use("/api", aiRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});