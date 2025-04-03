const Speaker = require("../models/speakers.model.js");
const dotenv = require("dotenv");
const fs = require("fs-extra");

// configuration file
dotenv.config();

const getSpeakers = async (req, res) => {
  try {
    const speaker = await Speaker.find();
    const response = speaker.map((value) => {
      return {
        id: value._id,
        title: value.title,
        speakerRole: value.speakerRole,
        speakerDescription:value.speakerDescription,
        speakerImage: value.speakerImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpeakersForAll = async (req, res) => {
  try {
    const speaker = await Speaker.find();
    const response = speaker.map((value) => {
      return {
        id: value._id,
        title: value.title,
        speakerRole: value.speakerRole,
        speakerDescription:value.speakerDescription,
        speakerImage: value.speakerImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addSpeakers = async (req, res) => {
  try {
    const existSpeaker = await Speaker.findOne({
      title: req.body.title,
    });
    if (existSpeaker != null) {
      return res.status(500).json({
        message: "The Speaker is already exist, please insert new Speaker !",
      });
    } else {
      const formData = {
        title: req.body.title,
        speakerRole: req.body.speakerRole,
        speakerDescription:req.body.speakerDescription,
        speakerImage: req.file.path,
      };
      const speaker = await Speaker.create(formData);

      res.status(200).json({
        id: speaker._id,
        title: speaker.title,
        speakerRole: speaker.speakerRole,
        speakerDescription:speaker.speakerDescription,
        speakerImage: speaker.speakerImage,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSpeakers = async (req, res) => {
  try {
    const { id } = req.params;
    const speaker = await Speaker.findById(id);
    if (!speaker) {
      return res.status(404).json({ message: "Speaker not Found !" });
    }

    if (speaker.speakerImage == req.body.file) {
      await Speaker.findByIdAndUpdate(id, {
        title: req.body.title,
        speakerDescription:req.body.speakerDescription,
        speakerRole: req.body.speakerRole,
      });
    } else {
      await Speaker.findByIdAndUpdate(id, {
        title: req.body.title,
        speakerRole: req.body.speakerRole,
        speakerDescription:req.body.speakerDescription,
        speakerImage: req.file.path,
      });
    }

    const updatedSpeaker = await Speaker.findById(id);
    res.status(200).json({
      id: updatedSpeaker._id,
      title: updatedSpeaker.title,
      speakerRole: updatedSpeaker.speakerRole,
      speakerDescription:updatedSpeaker.speakerDescription,
      speakerImage: updatedSpeaker.speakerImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSpeakers = async (req, res) => {
  try {
    const { id } = req.params;
    const path = process.env.FILE_PATH;
    const speaker = await Speaker.findById(id);

    if (!speaker) {
      return res.status(404).json({ message: "Speaker not Found !" });
    }
    await Speaker.findByIdAndDelete(id);
    await fs.remove(path + speaker.title);

    res.status(200).json({ message: "Speaker is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSpeakers,
  getSpeakersForAll,
  addSpeakers,
  updateSpeakers,
  deleteSpeakers,
};
