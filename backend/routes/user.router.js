const express = require("express");
const router = express.Router();

const {
  GetAllUser,
  RegisterUser,
} = require("../controllers/user.controller.js");
const { authenticateUser } = require("../controllers/admin.controller.js");

router.get("/getAllUser", authenticateUser, GetAllUser);
router.post("/registerUser", RegisterUser);

module.exports = router;
