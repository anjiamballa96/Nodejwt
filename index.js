const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
dotenv.config();

const PORT = 3030;

const users = [
  {
    id: 1,
    userName: "Rahul",
    password: "Rahul",
    isAdmin: true,
  },
  {
    id: 2,
    userName: "Ramesh",
    password: "Ramesh",
    isAdmin: false,
  },
];

app.post("/api/login",async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = users.find((e) => {
      return e.userName === userName && e.password === password;
    });
    if (user) {
      const jwtToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin },process.env.SECRET_KEY);
      res.json({ userName: user.userName, isAdmin: user.isAdmin, jwtToken });
    } else {
      res.status(401).json("user not found");
    }
  } catch (err) {
    res.status(401).json({ message: err });
  }
});
app.listen("3000", () => {
  console.log("Server started on http://localhost:3000");
});
