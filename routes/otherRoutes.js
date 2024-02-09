const express = require("express");
const { isAuthenticated, authorizeAdmin } = require("../middlewares/auth");
const { getDashboardStats } = require("../controllers/otherController");
const router = express.Router();

// Get Admin Dashboard Stats
router.route("/admin/stats").get(isAuthenticated,authorizeAdmin,getDashboardStats)

module.exports = router;
