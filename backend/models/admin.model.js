const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

const adminSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Please insert UserName"],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: false,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Admin", adminSchema);
