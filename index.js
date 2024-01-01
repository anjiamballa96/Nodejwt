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

const verifyAuth = (req,res,next) => {
    const userToken = req.headers.authorization
    if(userToken){
        const token = userToken.split(" ")[1]
        jwt.verify(token,process.env.SECRET_KEY,(err,user) => {
            if(err){
                return res.status(403).json({Error : 'Token is not valid'})
            }
            res.user = user
            next()
        })
    }else{
        res.status(401).json({error : "you are not authorized"})
    }
}
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

app.delete("/api/users/:userId",verifyAuth,(req,res) => {
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json({message : "user deleted succesfully"})
    }else{
        res.status(401).json({error : "not eligible"})
    }
})

app.post("/api/logout",(req,res) => {
    const userToken = req.headers.authorization
    if(userToken){
        const token = userToken.split(" ")[1]
        if(token){
            let allTokens = []
            const tokenIndex = allTokens.indexOf(token)
            if(tokenIndex!== -1){
                allTokens.splice(tokenIndex,1)
                res.status(200).json("Log out successfully")
                res.redirect("/")
            }else{
                res.status(400).json("you are not valid user")
            }
        }else{
            res.status(400).json("token not found")
        }
    }else{
        res.status(400).json("you are not authenicated")
    }
})
app.listen("3030", () => {
  console.log("Server started on http://localhost:3030");
});
