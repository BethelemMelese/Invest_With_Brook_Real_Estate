const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please insert First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please insert First Name"],
    },
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Please insert First Name"],
    },
    phone: {
      type: String,
      required: [true, "Please insert First Name"],
    },
    profession: {
      type: String,
      required: [true, "Please insert Profession"],
    },
    country: {
      type: String,
      required: [true, "Please insert Country"],
    },
    city: {
      type: String,
      required: [true, "Please insert City"],
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("User", userSchema);
