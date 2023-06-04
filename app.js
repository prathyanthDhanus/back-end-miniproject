const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const admin = require("./admin")
const users = require("./user");
const jwt = require("jsonwebtoken");
const port = 3000;



mongoose.connect("mongodb://127.0.0.1:27017/testdb");
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

//middleware creation using if else
// function verifyToken(req,res,next){
//   let authHeaders = req.headers.authorization
//   if(authHeaders==undefined){
//     res.status(401).send("no token provided")
//   }
//   let token = authHeaders.split(" ")[1]
//   jwt.verify(token,"scrtkey",(err)=>{
//     if(err){
//       res.send("invalid token")
//     }else{
//       next();
//     }
//   })
// }

//middleware creation using ternary
function verifyToken(req, res, next) {
  let authHeaders = req.headers.authorization;
  authHeaders == undefined
    ? res.status(401).send("no token provided")                     //if
    : jwt.verify(authHeaders.split(" ")[1], "scrtkey", (err) => {   //else
      err ? res.send("invalid token")                             //if
        : next();                                                  //else
    });
}


//register admin acount
app.post("/register", async (req, res) => {
  const Admin = new admin(req.body);
  const body = req.body.username
  try {
    const outcome = await Admin.save();
    const tkn = jwt.sign(body, "scrtkey")
    res.send({ auth: true, token: tkn, outcome })

  } catch (err) {
    console.log("an error foumd", err)
  }

})


//login admin
app.post("/login",  async (req, res) => {
  try {
    const Username = req.body.username
    const Password = req.body.password
    const Admin = await admin.findOne({ username: Username })

    !Admin
      ? res.send("please register") //if
      : Admin.password == Password   //else
        ? res.send("login successfully")  //if
        : res.send("incorrect password")   //else

  } catch (err) {
    console.log("Error found", err);
  }
})

//user creation 
app.post("/users", async (req, res) => {
  const User = new users(req.body)
  try {
    const output = await User.save()
    res.send(output)
  } catch (err) {
    console.log("an error found", err)
  }

})

//get all users
app.get("/users", verifyToken, async (req, res) => {
  try {
    const userdata = await users.find()
    res.send(userdata)
  } catch (err) {
    console.log("wrong user", err)
  }
})

//get user by id
app.get("/users/:id", verifyToken, async (req, res) => {
  const userId = req.params.id
  try {
    const result = await users.findById(userId)
    res.send(result)

  } catch (err) {
    console.log("wrong user", err)
  }
})

//update a specific user
app.put('/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id
  const data = req.body
  try {
    const result = await users.findByIdAndUpdate(userId,data)
    res.send(result)

  } catch (err) {
    console.log, og("wrong user", err)
  }
})

//delete user
app.delete("/users/:id", verifyToken, async (req, res) => {
  const userId = req.params.id
  const data = req.body
  try {
    const result = await users.findByIdAndDelete(userId,data)
    res.send(result)
  } catch (err) {
    console.log("user not found")
  }

})

  .listen(3000, () => {
    console.log(`port is listening on ${port}`)
  })














