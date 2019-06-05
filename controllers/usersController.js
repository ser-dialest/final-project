var db = require('../models');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require("dotenv").config();

// Routes
// =============================================================
module.exports = {
  validateToken: function(req, res, next) {
    return jwt.verify(req.body.token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(400).send({ msg: 'Bad token' });
      }
      req.user = decoded;
      next();
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
    if (req.body.email) {
      let regex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (!regex.test(String(req.body.email).toLowerCase())) {
        return res.status(400).send({msg: "Invalid Email Address"})
      }
    }
    if (req.body.password) {
      let regex = RegExp(/^(?=.{8,})(?=.*[0-9])(?=.*[A-Za-z])/);
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
  },

  save: function(req, res) {
    db.User
      .findOneAndUpdate({ "username": req.user.username}, {$set: {"state": req.body.state}})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  load: function(req, res) {
    db.User
      .findOne({ "username": req.user.username})
      .then(dbModel => res.json(dbModel.state))
      .catch(err => res.status(422).json(err));
  }
};

