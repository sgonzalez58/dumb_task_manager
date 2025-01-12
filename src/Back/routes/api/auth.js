const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const dotenv = require("dotenv").config();
const jwt = require('jsonwebtoken')

// Placeholder routes for authentication
router.post("/login", (req, res) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err) {
      return res.json({
        err: err.message,
      });
    }
    if (user && user.connected) {
        
      return res.json({
        user: {
          isAdmin : user.isadmin,
          username : user.username
        },
        token: jwt.sign({
            userId: user.id
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h'}
          )
      });
    }
    return res.json({
      err: 'Erreur lors de la connexion',
    });
  });
});
router.post("/register", (req, res) => {
  const { username, password, email, confirmPassword, gdpr } = req.body;

  // Vérification username
  if (!username || username.trim() === "") {
    return res.json({
      err: 'L\'username ne peut pas être vide.',
    });
  }

  // Vérification mot de passe
  const passwordRegex = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /[0-9]/,
    special: /[&#'{(\[\-|_\\^@)\]$%!?.)}]/,
  };

  if (
    !password ||
    password.length < 12 ||
    !passwordRegex.lowercase.test(password) ||
    !passwordRegex.uppercase.test(password) ||
    !passwordRegex.number.test(password) ||
    !passwordRegex.special.test(password)
  ) {
    return res.json({
      err: "Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.",
    });
  }

  // Vérification confirmation mot de passe
  if (password !== confirmPassword) {
    return res.json({
      err: "Les mots de passe ne correspondent pas.",
    });
  }

  // Vérification email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.json({
      err: "Email invalide.",
    });
  }

  // Vérification GDPR
  if (!gdpr) {
    return res.json({
      err: "Vous devez accepter les conditions d'utilisation.",
    });
  }

  User.create({ username, password, email }, (err, user) => {
    if (err) {
      // Si l'erreur concerne un doublon (email ou username déjà utilisé)
      if (err.code === "23505") {
        return res.json({
          err: "Cet email ou nom d'utilisateur est déjà utilisé.",
        });
      }
      return res.json({
        err: "Erreur lors de la création du compte.",
      });
    }
    if (user && user.id) {
      return res.json({
        user: {
          username: user.username,
          isAdmin : user.isadmin
        }
      });
    }
    return res.json({
      err: "Erreur lors de la création du compte.",
    });
  });
});


module.exports = router;
