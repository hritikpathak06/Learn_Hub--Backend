const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  changePassword,
  updateProfile,
  updateProfilePicture,
  addToPlaylist,
  removeFromPlaylist,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticated, authorizeAdmin } = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");
const router = express.Router();

// Register User
router.route("/register").post(singleUpload, registerUser);

// Login User
router.route("/login").post(loginUser);

// Logout User
router.route("/logout").get(logoutUser);

// Get My Profile
router.route("/me").get(isAuthenticated, getMyProfile);

// Change Password
router.route("/changepassword").put(isAuthenticated, changePassword);

// Update Profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

// Update Profile Picture
router
  .route("/updateprofilepicture")
  .put(isAuthenticated, singleUpload, updateProfilePicture);

// Forget Password

// Reset Password

// Add To Playlist
router.route("/addtoplaylist").post(isAuthenticated, addToPlaylist);

// Remove From Playlist
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

// Get All Users == ADMIN
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

// Update User Role == ADMIN
router
  .route("/admin/user/:id")
  .put(isAuthenticated, authorizeAdmin, updateUserRole)
  .delete(isAuthenticated, authorizeAdmin, deleteUser);

module.exports = router;
