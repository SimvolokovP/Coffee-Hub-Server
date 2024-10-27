const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const bot = require("./bot");

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use(orderRoutes);

app.listen(PORT, () => console.log("Server start on " + PORT));