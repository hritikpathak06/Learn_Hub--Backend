const jwt = require("jsonwebtoken");
const { catchAsyncError } = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");

// Is Authenticated Middleware
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
});

// Admin Middleware
exports.authorizeAdmin = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new ErrorHandler(
        `${req.user.role} is not allowed to access this resource`,
        400
      )
    );
  }
  next();
});

// Authorize subscriber
exports.authorizeSubscribers = catchAsyncError(async (req, res, next) => {
  if (req.user.subscription.status !== "active" && req.user.role !== "admin") {
    return next(new ErrorHandler(`Plase Subscribe To Continue`, 400));
  }
  next();
});
