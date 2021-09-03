const Item = require("../models/item");
const Vendor = require("../models/vendor");
const Category = require("../models/category");
const async = require("async");

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback);
      },
      vendor_count: function (callback) {
        Vendor.countDocuments({}, callback);
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Odin General Store",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all items.
exports.item_list = function (req, res) {
  Item.find({}, "name price").exec(function (err, list_items) {
    if (err) {
      return next(err);
    }
    res.render("item_list", { title: "All Items", item_list: list_items });
  });
};

// Display detail page for a specific item.
exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("vendor")
    .populate("category")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_detail", {
        title: item.name,
        item: item,
      });
    });
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
