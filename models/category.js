const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, minlength: 3, maxLength: 100, required: true },
  description: { type: String, maxLength: 250, required: true },
});

// Virtual for category's URL
CategorySchema.virtual("url").get(function () {
  return "/category/" + this._id;
});

//Export model
module.exports = mongoose.model("Category", CategorySchema);
