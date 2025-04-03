const User = require("../models/user.model.js");

const GetAllUser = async (req, res) => {
  try {
    const user = await User.find();
    const response = user.map((values) => {
      return {
        id: values._id,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        profession: values.profession,
        country: values.country,
        city: values.city,
        attendeeType:values.attendeeType
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const RegisterUser = async (req, res) => {
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      fullName: req.body.firstName + " " + req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      profession: req.body.profession,
      country: req.body.country,
      city: req.body.city,
      attendeeType:req.body.attendeeType,
    });

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profession: user.profession,
      country: user.country,
      city: user.city,
      attendeeType:user.attendeeType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  GetAllUser,
  RegisterUser,
};
