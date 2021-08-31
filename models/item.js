const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, maxLength: 100, required: true },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  description: { type: String, maxLength: 500, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  price: { type: Number, min: 0, max: 99999, required: true },
  inStock: { type: Number, min: 0, max: 1000, required: true },
});

// Virtual for item's URL
ItemSchema.virtual("url").get(function () {
  return "/item/" + this._id;
});

//Export model
module.exports = mongoose.model("Item", ItemSchema);
