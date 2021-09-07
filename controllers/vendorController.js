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
exports.vendor_delete_get = function (req, res, next) {
  async.parallel(
    {
      vendor: function (callback) {
        Vendor.findById(req.params.id).exec(callback);
      },
      vendors_items: function (callback) {
        Item.find({ vendor: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.vendor == null) {
        res.redirect("/vendors");
      }
      res.render("vendor_delete", {
        title: "Delete Vendor",
        vendor: results.vendor,
        vendor_items: results.vendors_items,
      });
    }
  );
};

// Handle Vendor delete on POST.
exports.vendor_delete_post = function (req, res, next) {
  async.parallel(
    {
      vendor: function (callback) {
        Vendor.findById(req.body.vendorid).exec(callback);
      },
      vendors_items: function (callback) {
        Item.find({ vendor: req.body.vendorid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.vendors_items.length > 0) {
        res.render("vendor_delete", {
          title: "Delete Vendor",
          vendor: results.vendor,
          vendor_items: results.vendors_items,
        });
        return;
      } else {
        Vendor.findByIdAndRemove(req.body.vendorid, function deleteVendor(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/vendors");
        });
      }
    }
  );
};

// Display Vendor update form on GET.
exports.vendor_update_get = function (req, res) {
  Vendor.findById(req.params.id, function (err, vendor) {
    if (err) {
      return next(err);
    }
    if (vendor == null) {
      const err = new Error("Vendor not found");
      err.status = 404;
      return next(err);
    }
    res.render("vendor_form", { title: "Update Vendor", vendor: vendor });
  });
};

// Handle Vendor update on POST.
exports.vendor_update_post = [
  body("name", "Vendor name required").trim().isLength({ min: 1 }).escape(),
  body("description", "Vendor description required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const vendor = new Vendor({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      res.render("vendor_form", {
        title: "Update Vendor",
        vendor: vendor,
        errors: errors.array(),
      });
      return;
    } else {
      Vendor.findByIdAndUpdate(
        req.params.id,
        vendor,
        {},
        function (err, thevendor) {
          if (err) {
            return next(err);
          }
          res.redirect(thevendor.url);
        }
      );
    }
  },
];
