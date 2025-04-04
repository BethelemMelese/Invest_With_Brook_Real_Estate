const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  getHeroSections,
  getHeroSectionsForAll,
  addHeroSections,
  updateHeroSections,
  deleteHeroSections,
} = require("../controllers/heroSection.controller.js");
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
router.get("/", authenticateUser, getHeroSections);
router.get("/get", getHeroSectionsForAll);
// router.post("/", authenticateUser, upload.single("file"), addHeroSections);
router.post("/", authenticateUser, addHeroSections);
// router.put("/:id", authenticateUser, upload.single("file"), updateHeroSections);
router.put("/:id", authenticateUser, updateHeroSections);
router.delete("/:id", authenticateUser, deleteHeroSections);

module.exports = router;
