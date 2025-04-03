const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  getSpeakers,
  getSpeakersForAll,
  addSpeakers,
  updateSpeakers,
  deleteSpeakers,
} = require("../controllers/speaker.controller.js");
const { authenticateUser } = require("../controllers/admin.controller.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary.js");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "speakers-images",
    format: async (req, file) => "jpg" || "png" || "jpeg",
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });
router.get("/", authenticateUser, getSpeakers);
router.get("/allSpeaker", getSpeakersForAll);
router.post("/", authenticateUser, upload.single("file"), addSpeakers);
router.put("/:id", authenticateUser, upload.single("file"), updateSpeakers);
router.delete("/:id", authenticateUser, deleteSpeakers);

module.exports = router;
