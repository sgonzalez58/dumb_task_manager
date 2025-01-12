const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const { User } = require("../models/user");
 
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    User.findById(userId, (err, user) => {
      if (err || !user || !user.isadmin) {
        return res.json({
          err: "Accès non autorisé",
          userId: req.session.userId,
          username: req.session.username,
          isAdmin: false,
        });
      }
      req.auth = {
          userId: userId
      };
      next();
    });
  } catch(error) {
      res.json({
        err: error
      });
  }
};