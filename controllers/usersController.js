var db = require('../models');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require("dotenv").config();

// Routes
// =============================================================
module.exports = {
  validateToken: function(req, res) {
    return jwt.verify(req.body.token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(400).send({ msg: 'Bad token' });
      }
      return res.status(200).send({ msg: 'Good token' });
    });
  },
  
  login: function(req, res) {
    db.User.findOne({ username: req.body.username }).then(u => {
      if (u === null) {
        res.status(400).send({ msg: 'Invalid Username or Password' });
      } else {
        bcrypt.compare(req.body.password, u.password, function(err, bRes) {
          if (!bRes) {
            res.status(400).send({ msg: 'Invalid Username or Password' });
          } else {
            var token = jwt.sign({ username: u.username }, process.env.JWT_SECRET);
            res.json({ username: u.username, token: token });
          };
        });
      };
    });
  },

  signup: function(req, res) {
    console.log(req.body);
    if (req.body.email) {
      let regex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      console.log(regex.test(String(req.body.email).toLowerCase()), "e-mail");
      if (!regex.test(String(req.body.email).toLowerCase())) {
        return res.status(400).send({msg: "Invalid Email Address"})
      }
    }
    if (req.body.password) {
      let regex = RegExp(/^(?=.{8,})(?=.*[0-9])(?=.*[A-Za-z])/);
      console.log(regex.test(String(req.body.password)), "password");
      if (!regex.test(String(req.body.password))) {
        return res.status(400).send({msg: "Password must contain letters and numbers and be at least 8 characters long."})
      }
    }
    db.User.findOne({ username: req.body.username }).then(u => {
      if (u) {
        res.status(400).send({ msg: 'Invalid Username or Password' }) 
      } else {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(req.body.password, salt, function(err, hash) {
            db.User.create({
              username: req.body.username,
              email: "" || req.body.email,
              password: hash,
            }).then(function(user) {
              var token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
              res.json({ username: user.username, token: token });
            });
          });
        });
      }
    });
  }
};

