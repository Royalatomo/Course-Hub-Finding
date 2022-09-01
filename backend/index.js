const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config()

const PORT = process.env.PORT || 5005;

const url = process.env.MONGO_LINK;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(cors())
app.use(express.json());

const con = mongoose.connection;
con.on("error", () => console.log("DB connection Error"));
con.on("open", () => console.log("Connected to DB"));

app.use("/user", require("./user-route"));
app.use("/", require("./course-route"));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
