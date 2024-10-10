const mongoose = require("mongoose");
const { format } = require("date-fns");

const agentSchema = new mongoose.Schema({
  authorImage: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },
  agentName: { type: String, required: true },
  agentEmail: { type: String, required: true },
  agentPhone: { type: String, required: true },
  agentJoinDate: {
    type: String,
    required: true,
    default: () => (new Date(), "dd mm yyyy"),
  },
  agentAddress: { type: String, required: true },
  agentProvince: { type: String, required: true },
  agentCity: { type: String, required: true },
  agentZipCode: { type: Number, required: true },
});

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
