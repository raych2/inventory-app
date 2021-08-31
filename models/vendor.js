const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  name: { type: String, maxLength: 100, required: true },
  description: { type: String, maxLength: 500, required: true },
});

// Virtual for vendor's URL
VendorSchema.virtual("url").get(function () {
  return "/vendor/" + this._id;
});

//Export model
module.exports = mongoose.model("Vendor", VendorSchema);
