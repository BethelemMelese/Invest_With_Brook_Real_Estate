const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  getAgents,
  getAgentsForAll,
  addAgents,
  updateAgents,
  deleteAgents,
} = require("../controllers/agents.controller.js");
const { authenticateUser } = require("../controllers/admin.controller.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "agents-images",
    format: async (req, file) => "jpg" || "png" || "jpeg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });
router.get("/", authenticateUser, getAgents);
router.get("/allAgent", getAgentsForAll);
router.post("/", authenticateUser, upload.single("file"), addAgents);
router.put("/:id", authenticateUser, upload.single("file"), updateAgents);
router.delete("/:id", authenticateUser, deleteAgents);

module.exports = router;
