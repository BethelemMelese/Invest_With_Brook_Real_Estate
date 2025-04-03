const Admin = require("../models/admin.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// configuration file
dotenv.config();

const RegisterAdmin = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.password, 10);
    const admin = await Admin.create({
      userName: req.body.userName,
      passwordHash: password,
    });

    res.status(200).json({
      id: admin._id,
      userName: admin.userName,
      passwordHash: admin.passwordHash,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LoginAdmin = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const admin = await Admin.findOne({ userName });
    if (!admin) {
      return res.status(404).json({
        message: "Your account isn't Found, Please insert correctly !",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(password, admin.passwordHash);

    const generateToken = jwt.sign(
      { id: admin._id, name: userName },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    if (admin && isPasswordMatch) {
      await Admin.findByIdAndUpdate(admin._id, {
        token: generateToken,
      });

      const updatedAdmin = await Admin.findOne({ userName });
      // Store token in HttpOnly cookie
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.cookie("token", generateToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3600000,
      });
      res.status(200).json({
        message: "Login is Successfully Done !",
        token: updatedAdmin.token,
        role: "Admin",
        name: updatedAdmin.userName,
      });
    } else if (!isPasswordMatch) {
      res.status(404).json({
        message: "Your account isn't Found, Please insert correctly !",
      });
    } else {
      res.status(404).json({
        error: "Your account isn't Found, Please insert correctly !",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const LogOutAdmin = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById({ _id: req.user.id });
    if (admin == null) {
      return res
        .status(404)
        .json({ message: "User is not Found, Please insert correctly !" });
    } else {
      const isPasswordMatch = bcrypt.compareSync(
        oldPassword,
        admin.passwordHash
      );
      if (!isPasswordMatch) {
        return res.status(404).json({
          message:
            "The Old Password not Correct, please insert the old password correctly!",
        });
      }
      const saltRounds = 10;
      const password = bcrypt.hashSync(newPassword, saltRounds);
      await Admin.updateOne({ _id: admin._id }, { passwordHash: password });
      res.status(200).json({ message: "Password is Successfully Updated !" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verificationToken = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const protect = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to verify JWT
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const getUserByToken = async (req, res) => {
  try {
    const { token } = req.params;
    const admin = await Admin.findOne({ token: token });
    if (!admin) {
      res.status(404).json({ message: "User not Found !" });
    }

    res.status(200).json({
      id: admin._id,
      userName: admin.userName,
      passwordHash: admin.passwordHash,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  LoginAdmin,
  LogOutAdmin,
  RegisterAdmin,
  updatePassword,
  verificationToken,
  getUserByToken,
  protect,
  authenticateUser,
};
