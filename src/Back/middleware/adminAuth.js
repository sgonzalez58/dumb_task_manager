const adminAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).redirect("/login");
  }

  const { User } = require("../models/user");
  User.findById(req.session.userId, (err, user) => {
    if (err || !user || user.role == 'user') {
      return res.status(403).render("pages/error", {
        message: "Accès non autorisé",
        error: { status: 403 },
        userId: req.session.userId,
        username: req.session.username,
        role: req.session.role,
      });
    }
    req.session.role = user.role;
    next();
  });
};

module.exports = adminAuth;
