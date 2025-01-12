const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const adminAuth = require("../../middleware/apiAdminAuth");

router.get("/", adminAuth, (req, res) => {
  User.getAll((err, users) => {
    if (err) {
      return res.json({
        err: "Erreur lors de la récupération des utilisateurs"
      });
    }
    res.json({
      users
    });
  });
});

router.post("/toggle-admin/:userId", adminAuth, (req, res) => {
  const targetUserId = req.params.userId;
  const isAdmin = req.body.isAdmin;

  if (targetUserId === adminAuth.userId) {
    return res.json({
      err: "Vous ne pouvez pas modifier vos propres droits d'administrateur"
    });
  }

  User.toggleAdmin(targetUserId, isAdmin, (err) => {
    if (err) {
      return res.json({
        err: "Erreur lors de la modification du statut admin"
      });
    }
    res.json({
      user: {
        id: targetUserId
      }
    });
  });
});

router.post("/delete-user", adminAuth, (req, res) => {
  const targetUserId = req.body.idToDelete;
  console.log(targetUserId)

  if (targetUserId === adminAuth.userId) {
    return res.json({
      err: "Vous ne pouvez pas supprimer votre propre compte"
    })
  }

  User.delete(targetUserId, (err) => {
    if (err) {
      return res.json({
        err: "Erreur lors de la suppression de l'utilisateur"
      });
    }
    res.json({
      user: {
        id: targetUserId
      }
    });
  });
});

module.exports = router;
