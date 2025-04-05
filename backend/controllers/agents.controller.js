const Agent = require("../models/agents.model.js");
const dotenv = require("dotenv");
const fs = require("fs-extra");

// configuration file
dotenv.config();

const getAgents = async (req, res) => {
  try {
    const agent = await Agent.find();
    const response = agent.map((value) => {
      return {
        id: value._id,
        title: value.title,
        agentDescription: value.agentDescription,
        agentImage: value.agentImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAgentsForAll = async (req, res) => {
  try {
    const agent = await Agent.find();
    const response = agent.map((value) => {
      return {
        id: value._id,
        title: value.title,
        agentDescription: value.agentDescription,
        agentImage: value.agentImage,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addAgents = async (req, res) => {
  try {
    const existAgent = await Agent.findOne({
      title: req.body.title,
    });
    if (existAgent != null) {
      return res.status(500).json({
        message: "The Agent is already exist, please insert new Agent !",
      });
    } else {
      const formData = {
        title: req.body.title,
        agentDescription: req.body.agentDescription,
        agentImage: req.file.path,
      };
      const agent = await Agent.create(formData);

      res.status(200).json({
        id: agent._id,
        title: agent.title,
        agentDescription: agent.agentDescription,
        agentImage: agent.agentImage,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAgents = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not Found !" });
    }

    if (agent.agentImage == req.body.file) {
      await Agent.findByIdAndUpdate(id, {
        title: req.body.title,
        agentDescription: req.body.agentDescription,
      });
    } else {
      await Agent.findByIdAndUpdate(id, {
        title: req.body.title,
        agentRole: req.body.agentRole,
        agentDescription: req.body.agentDescription,
      });
    }

    const updatedAgent = await Agent.findById(id);
    res.status(200).json({
      id: updatedAgent._id,
      title: updatedAgent.title,
      agentDescription: updatedAgent.agentDescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAgents = async (req, res) => {
  try {
    const { id } = req.params;
    const path = process.env.FILE_PATH;
    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not Found !" });
    }
    await Agent.findByIdAndDelete(id);
    await fs.remove(path + agent.title);

    res.status(200).json({ message: "Agent is Successfully Delete !" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAgents,
  getAgentsForAll,
  addAgents,
  updateAgents,
  deleteAgents,
};
