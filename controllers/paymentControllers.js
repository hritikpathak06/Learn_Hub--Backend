const { catchAsyncError } = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const RazorPay = require("razorpay");
const Payment = require("../models/paymentModel");
const crypto = require("crypto");

const instance = new RazorPay({
  key_id: "rzp_test_GzEfKJiOtnPEpR",
  key_secret: "Gbv8jKvVnj9sdhfsF24eZkIz",
});

// Buy Subscription Controller
exports.buySubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role === "admin")
      return next(new ErrorHandler("Admin can't buy subscription", 400));
    const plan_id = "plan_NUkQ9OI3lX097s";
    const subscription = await instance.subscriptions.create({
      plan_id,
      customer_notify: 1,
      total_count: 12,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;
    await user.save();
    res.status(201).json({
      success: true,
      // subscription,
      subscriptionId: subscription.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

// Payment Verfication Controller
exports.paymentVerification = catchAsyncError(async (req, res, next) => {
  const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } =
    req.body;

  const user = await User.findById(req.user._id);

  const subscription_id = user.subscription.id;

  const generated_signature = crypto
    .createHmac("sha256", "Gbv8jKvVnj9sdhfsF24eZkIz")
    .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
    .digest("hex");
  const isAuthentic = generated_signature === razorpay_signature;
  if (!isAuthentic)
    return res.redirect(`https://learnhub-tau.vercel.app/paymentfail`);
  await Payment.create({
    razorpay_signature,
    razorpay_payment_id,
    razorpay_subscription_id,
  });
  user.subscription.status = "active";
  await user.save();
  res.redirect(
    `https://learnhub-tau.vercel.app/paymentsuccess?reference=${razorpay_payment_id}`
  );
});

// GET Razorpay Api Key Secret
exports.getRazorPayKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    key: "rzp_test_GzEfKJiOtnPEpR",
  });
});

// Cancel Subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subscriptionId = user.subscription.id;

    // Check if the subscription is already cancelled
    if (user.subscription.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Subscription is already cancelled.",
      });
    }

    // Check if the subscription is in a cancellable state
    // if (!canCancelSubscription(user.subscription.status)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Subscription cannot be cancelled in the current status.",
    //   });
    // }
    // Attempt to cancel the subscription
    await instance.subscriptions.cancel(subscriptionId);
    user.subscription.id = undefined;
    user.subscription.status = "cancelled";
    await user.save();
    res.status(200).json({
      success: true,
      message: "Subscription Cancelled!! Money Will Be Refunded Soon",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
