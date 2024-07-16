const express = require("express");
const cors = require("cors");
const { mongoose } = require("mongoose");
const User = require("./models/User");
const env = require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();

const salt = bcrypt.genSaltSync(10);
const secret = "kdhqijqoijqmsxmsiswbafG"; //secret key for JWT

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
//to parse JSON from the request we use express.json()
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    //logged in
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      //if token is generated, callback function is executed
      if (err) throw err;
      //a cookie named token is set with value
      res.cookie("token", token).json("ok");
    });
  } else {
    res.status(400).json("Wrong credentials");
  }
});

//check whether logged in or not
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.listen(4000);
