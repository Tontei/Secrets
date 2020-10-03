require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new Schema({
  email: String,
  password: String,
});


const User = mongoose.model("User", userSchema);

///////////////////////////////////Requests for the home route/////////////////

app
  .route("/")

  .get((req, res) => {
    res.render("home");
  });

///////////////////////////////////Requests for the register route/////////////////

app
  .route("/register")

  .get((req, res) => {
    res.render("register");
  })

  .post((req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      const newUser = new User({
        email: req.body.username,
        password: hash,
      });
  
      newUser.save((err) => {
        if (err) console.log(err);
        else res.render("secrets");
      });
    });
    
  });

///////////////////////////////////Requests for the login route/////////////////

app
  .route("/login")

  .get((req, res) => {
    res.render("login");
  })

  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
      if (err) console.log(err);
      else {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, (err, result) => {
            if (result === true) {
              res.render("secrets");
            }
          });
        }
      }
    });
  });

///////////////////////////////////Listening on port/////////////////

app.listen(3000, () => {
  console.log("server running on port 3000");
});
