const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouter = require("./routes/authRoutes")
require("./config/db");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to hell ⛑️");
});

app.use("/api/", authRouter)

app.listen(3004, () => {
  console.log(`Server running on port 3004`);
});
