const Item = require("../models/item");

exports.index = function (req, res) {
  res.send("NOT IMPLEMENTED: Odin General Store Home Page");
};

// Display list of all items.
exports.item_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Item list");
};

// Display detail page for a specific item.
exports.item_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Item detail: " + req.params.id);
};

// Display item create form on GET.
exports.item_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Item create GET");
};

// Handle item create on POST.
exports.item_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Item create POST");
};

// Display item delete form on GET.
exports.item_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Item delete GET");
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Item delete POST");
};

// Display item update form on GET.
exports.item_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Item update GET");
};

// Handle item update on POST.
exports.item_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Item update POST");
};