const express = require("express");
const {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addCourseLecture,
  deleteCourse,
  deleteCourseLecture,
} = require("../controllers/courseControllers");
const {
  isAuthenticated,
  authorizeAdmin,
  authorizeSubscribers,
} = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");
const router = express.Router();

// Get All Courses
router.route("/courses").get(getAllCourses);

// Create Course == Admin
router
  .route("/createcourse")
  .post(isAuthenticated, authorizeAdmin, singleUpload, createCourse);

// Add Lecture,Delete Course,Get Course Details
router
  .route("/course/:id")
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeAdmin, singleUpload, addCourseLecture)
  .delete(isAuthenticated, authorizeAdmin, deleteCourse);

// Delete Lectures
router
  .route("/lecture")
  .delete(isAuthenticated, authorizeAdmin, singleUpload, deleteCourseLecture);

module.exports = router;
