const mongoose = require("mongoose");

const agentsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please insert the Title"],
    },
    agentDescription: {
      type: String,
      required: false,
    },
    agentImage: {
      type: String,
      required: [true, "Please insert the Agent Image"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Agent", agentsSchema);
