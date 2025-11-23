const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true }, // Main, Stir-fry, Soup, Drink
  description: String,
  spicy: { type: Boolean, default: false },
  price: {
    student: { type: Number, required: true },
    staff: { type: Number, required: true },
    visitor: { type: Number, required: true }
  },
  image: String
});

module.exports = mongoose.model('Dish', dishSchema);