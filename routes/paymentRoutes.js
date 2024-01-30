const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const {
  buySubscription,
  paymentVerification,
  getRazorPayKey,
  cancelSubscription,
} = require("../controllers/paymentControllers");
const router = express.Router();

// Buy Subscription
router.route("/subscribe").get(isAuthenticated, buySubscription);

// Razor Pay Key
router.route("/getrazorpaykey").get(getRazorPayKey);

// Payment Verification
router.route("/paymentverification").post(isAuthenticated, paymentVerification);

// Cancel Subscription
router.route("/subscribe/cancel").delete(isAuthenticated,cancelSubscription);

module.exports = router;
