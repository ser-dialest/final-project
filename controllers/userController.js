const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Defining methods for the booksController
module.exports = {
  findOne: function(req, res) {
    const { name, password } = req.body;
    console.log(req.body);
    db.User
      .findOne({name})
      .then(dbModel => {
        if(!dbModel) {
          return res.status(404).json({
            error: "Username and password not matching"
          });
        }

        // if (dbModel.password !== password) {
        //   return res.status(404).json({
        //     error: "Username and password not matching"
        //   });
        // }
        bcrypt.compare(password, dbModel.password, function(err, same) {
          if (err) {
            return res.status(500).json({
              error: "Something went wrong"
            })
          }
          if (!same) {
            return res.status(404).json({
              error: "password username not matching"
            });
          }
          const { name, _id: id } = dbModel;

          const token = jwt.sign({name, id}, 'my-website-secrete');
          return res.json({ jwt: token })
        })
      })
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    const password = bcrypt.hashSync(req.body.password, 10);
    const name = req.body.name;
    db.User
      .create({ name, password})
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};