const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  //Common..........................................................
  type: {
    type: String,
    enum: ["house", "land"],
    required: true,
  },
  city: { type: String, required: false },
  title: { type: String, required: false },
  titleDescription: { type: String, required: false },
  price: { type: Number, required: false },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  map: { type: String, required: true },
  description: { type: String, required: false },
  photos: [
    {
      public_id: { type: String, required: false }, // Unique ID for each photo
      url: { type: String, required: false },
    },
  ],
  videos: [
    {
      public_id: { type: String, required: false }, // Unique ID for each video
      url: { type: String, required: false },
    },
  ],
  //For House.....................................................
  squareFeet: { type: Number, required: false },
  bedrooms: { type: Number, required: false },
  bathrooms: { type: Number, required: false },
  parking: { type: String, required: false },
  //For Land......................................................
  sizeType: {
    type: String,
    required: false,
    // enum: ['Small', 'Medium', 'Large']
  },
  size: { type: Number, required: false },
  priceType: {
    type: String,
    required: false,
    // enum: ['Per Acre', 'Per Hectare']
  },
  pricePerUnit: { type: Number, required: false },
});

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
