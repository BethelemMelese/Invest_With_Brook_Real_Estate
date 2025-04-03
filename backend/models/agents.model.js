const mongoose = require("mongoose");

const speakersSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please insert the Title"],
    },
    speakerRole: {
      type: String,
      required: false,
    },
    speakerDescription: {
      type: String,
      required: false,
    },
    speakerImage: {
      type: String,
      required: [true, "Please insert the Speaker Image"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Speaker", speakersSchema);
