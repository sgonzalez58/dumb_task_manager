// @ts-nocheck

const express = require("express");
const router = express.Router();
const Task = require("../../models/task");
const { User } = require("../../models/user");
const auth = require('../../middleware/apiAuth')
const jwt = require('jsonwebtoken')



router.get("/", auth, (req, res) => {

  Task.getAllByUser(req.auth.userId, (err, data) => {
    if (err) {
      return res.json({
        err:"Erreur lors de la récupération des tâches"
    });
    }

    User.findById(req.auth.userId, (err, user) => {
      if (err) {
        return res.json({
            err:"Erreur lors de la récupération de l'utilisateur"
        });
      }
      return res.json({
        data: data || [],
      });
    });
  });
});

router.get("/remove/:taskId", auth, (req, res) => {
  const taskId = req.params.taskId;

  Task.delete(taskId, req.session.userId, (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.redirect("/tasks");
  });
});

router.post("/", auth, (req, res) => {
  const { title, description, completion } = req.body;

  Task.create(
    {
      user_id: req.session.userId,
      title,
      description,
      completed: completion,
    },
    (err, task) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.redirect("/tasks");
    }
  );
});

router.post("/toggle/:taskId", auth, (req, res) => {
  const taskId = req.params.taskId;

  Task.toggle(taskId, req.session.userId, (err, task) => {
    if (err) {
      console.error("Erreur toggle:", err);
      return res.status(500).send(err.message);
    }
    res.redirect("/tasks");
  });
});

module.exports = router;
