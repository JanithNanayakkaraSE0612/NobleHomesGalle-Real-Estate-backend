const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  //Common..........................................................
  type: {
    type: String,
    enum: ["house", "land"],
    required: true,
  },
  city: { type: String, required: true },
  title: { type: String, required: true },
  titleDescription: { type: String, required: true },
  price: { type: Number, required: true },
  agent: { type: String, required: true },
  map: { type: String, required: true },
  description: { type: String, required: true },
  photos: [
    {
      public_id: { type: String, required: true }, // Unique ID for each photo
      url: { type: String, required: true },
    },
  ],
  videos: [
    {
      public_id: { type: String, required: true }, // Unique ID for each video
      url: { type: String, required: true },
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
