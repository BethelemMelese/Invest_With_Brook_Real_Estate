const HeroSection = require("../models/heroSection.model.js");
const dotenv = require("dotenv");
const fs = require("fs-extra");

// configuration file
dotenv.config();

const getHeroSections = async (req, res) => {
  try {
    const heroSection = await HeroSection.find();
    const response = heroSection.map((value) => {
      return {
        id: value._id,
        headerTitle: value.headerTitle,
        subTitle: value.subTitle,
        heroImage: value.heroImage,
        heroUrl:value.heroUrl
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHeroSectionsForAll = async (req, res) => {
  try {
    const heroSection = await HeroSection.find();
    const response = heroSection.map((value) => {
      return {
        id: value._id,
        headerTitle: value.headerTitle,
        subTitle: value.subTitle,
        heroImage: value.heroImage,
        heroUrl:value.heroUrl
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addHeroSections = async (req, res) => {
  try {
    const existHeroSection = await HeroSection.findOne({
      headerTitle: req.body.headerTitle,
    });
    if (existHeroSection != null) {
      return res.status(500).json({
        message:
          "The Hero Section is already exist, please insert new Hero Section !",
      });
    } else {
      const formData = {
        headerTitle: req.body.headerTitle,
        subTitle: req.body.subTitle,
        heroImage: req.file.path,
        heroUrl:req.body.heroUrl
      };
      const heroSection = await HeroSection.create(formData);

      res.status(200).json({
        id: heroSection._id,
        headerTitle: heroSection.headerTitle,
        subTitle: heroSection.subTitle,
        heroImage: heroSection.heroImage,
        heroUrl:heroSection.heroUrl
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHeroSections = async (req, res) => {
  try {
    const { id } = req.params;
    const heroSection = await HeroSection.findById(id);
    if (!heroSection) {
      return res.status(404).json({ message: "Hero Section not Found !" });
    }

    if (heroSection.heroImage == req.body.file) {
      await HeroSection.findByIdAndUpdate(id, {
        headerTitle: req.body.headerTitle,
        subTitle: req.body.subTitle,
        heroUrl:req.body.heroUrl
      });
    } else {
      await HeroSection.findByIdAndUpdate(id, {
        headerTitle: req.body.headerTitle,
        subTitle: req.body.subTitle,
        heroImage: req.file.path,
        heroUrl:req.body.heroUrl
      });
    }

    const updatedHeroSection = await HeroSection.findById(id);
    res.status(200).json({
      id: updatedHeroSection._id,
      headerTitle: updatedHeroSection.headerTitle,
      subTitle: updatedHeroSection.subTitle,
      heroImage: updatedHeroSection.heroImage,
      heroUrl:updatedHeroSection.heroUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHeroSections = async (req, res) => {
  try {
    const { id } = req.params;
    const path = process.env.FILE_PATH;
    const heroSection = await HeroSection.findById(id);

    if (!heroSection) {
      return res.status(404).json({ message: "Hero Section not Found !" });
    }
    await HeroSection.findByIdAndDelete(id);
    await fs.remove(path + heroSection.headerTitle);

    res.status(200).json({ message: "Hero Section is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHeroSections,
  getHeroSectionsForAll,
  addHeroSections,
  updateHeroSections,
  deleteHeroSections,
};
