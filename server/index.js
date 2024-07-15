const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
const UserModel = require("./models/User");
const env = require("dotenv").config();
const app = express();

app.use(cors());
//to parse JSON from the request we use express.json()
app.use(express.json());

mongoose.connect(process.env.MONGO);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await UserModel.create({ username, password });
  res.json(userDoc);
});

app.listen(4000);
