const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  LoginAdmin,
  RegisterAdmin,
  updatePassword,
  getUserByToken,
  protect,
  LogOutAdmin,
  authenticateUser,
} = require("../controllers/admin.controller.js");

// Define rate limit middleware
const loginRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Allow 5 login attempts per 5 minutes
  message: "Too many login attempts. Please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginRateLimiter, LoginAdmin);
router.post("/logout", LogOutAdmin);
router.post("/", RegisterAdmin);
router.put("/changePassword", authenticateUser, updatePassword);
router.get("/UserInfo/:token", authenticateUser, getUserByToken);
router.get("/auth", protect);

module.exports = router;
