const Vendor = require("../models/vendor");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");

// Display list of all Vendors.
exports.vendor_list = function (req, res) {
  Vendor.find()
    .sort([["name", "ascending"]])
    .exec(function (err, list_vendors) {
      if (err) {
        return next(err);
      }
      res.render("vendor_list", {
        title: "All Vendors",
        vendor_list: list_vendors,
      });
    });
};

// Display detail page for a specific Vendor.
exports.vendor_detail = function (req, res, next) {
  async.parallel(
    {
      vendor: function (callback) {
        Vendor.findById(req.params.id).exec(callback);
      },
      vendors_items: function (callback) {
        Item.find({ vendor: req.params.id }, "name price description").exec(
          callback
        );
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.vendor == null) {
        const err = new Error("Vendor not found");
        err.status = 404;
        return next(err);
      }
      res.render("vendor_detail", {
        title: "Vendor Detail",
        vendor: results.vendor,
        vendor_items: results.vendors_items,
      });
    }
  );
};

// Display Vendor create form on GET.
exports.vendor_create_get = function (req, res) {
  res.render("vendor_form", { title: "Create Vendor" });
};

// Handle Vendor create on POST.
exports.vendor_create_post = [
  body("name", "Vendor name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Vendor description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("vendor_form", {
        title: "Create Vendor",
        vendor: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const vendor = new Vendor({
        name: req.body.name,
        description: req.body.description,
      });
      vendor.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(vendor.url);
      });
    }
  },
];

// Display Vendor delete form on GET.
exports.vendor_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor delete GET");
};

// Handle Vendor delete on POST.
exports.vendor_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor delete POST");
};

// Display Vendor update form on GET.
exports.vendor_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor update GET");
};

// Handle Vendor update on POST.
exports.vendor_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor update POST");
};
