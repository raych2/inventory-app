const Vendor = require("../models/vendor");

// Display list of all Vendors.
exports.vendor_list = function (req, res) {
  Vendor.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_vendors) {
      if (err) { return next(err); }
      res.render('vendor_list', { title: 'All Vendors', vendor_list: list_vendors });
    });
};

// Display detail page for a specific Vendor.
exports.vendor_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor detail: " + req.params.id);
};

// Display Vendor create form on GET.
exports.vendor_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor create GET");
};

// Handle Vendor create on POST.
exports.vendor_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Vendor create POST");
};

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
