const Item = require("../models/item");
const Vendor = require("../models/vendor");
const Category = require("../models/category");
const async = require("async");
const { body, validationResult } = require("express-validator");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype) {
    return cb(null, true);
  } else {
    cb("Invalid file type.  Only jpeg, jpg, and png image files are allowed.");
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 200 },
  fileFilter: fileFilter,
});

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
exports.item_create_get = function (req, res, next) {
  async.parallel(
    {
      vendors: function (callback) {
        Vendor.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        title: "Create Item",
        vendors: results.vendors,
        categories: results.categories,
      });
    }
  );
};

// Handle item create on POST.
exports.item_create_post = [
  upload.single("itemImage"),

  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("vendor", "Vendor must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().escape(),
  body("inStock", "Current number in stock must not be empty").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      vendor: req.body.vendor,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      inStock: req.body.inStock,
      itemImage: req.file.filename,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          vendors: function (callback) {
            Vendor.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render("item_form", {
            title: "Create Item",
            vendors: results.vendors,
            categories: results.categories,
            item: item,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      item.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(item.url);
      });
    }
  },
];

// Display item delete form on GET.
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("vendor")
    .populate("category")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      }
      if (item == null) {
        res.redirect("/items");
      }
      res.render("item_delete", { title: "Delete Item", item: item });
    });
};

// Handle item delete on POST.
exports.item_delete_post = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("vendor")
    .populate("category")
    .exec(function (err, item) {
      if (err) {
        return next(err);
      } else {
        Item.findByIdAndRemove(req.body.id, function deleteItem(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/items");
        });
      }
    });
};

// Display item update form on GET.
exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id)
          .populate("vendor")
          .populate("category")
          .exec(callback);
      },
      vendors: function (callback) {
        Vendor.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      res.render("item_form", {
        title: "Update Item",
        vendors: results.vendors,
        categories: results.categories,
        item: results.item,
      });
    }
  );
};

// Handle item update on POST.
exports.item_update_post = [
  upload.single("itemImage"),

  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("vendor", "Vendor must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").trim().escape(),
  body("inStock", "Current number in stock must not be empty").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      vendor: req.body.vendor,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      inStock: req.body.inStock,
      itemImage: req.file,
      _id: req.params.id,
    });

    if (req.file) {
      const newImage = req.file.filename;
      item.itemImage = newImage;
    }

    if (!errors.isEmpty()) {
      async.parallel(
        {
          vendors: function (callback) {
            Vendor.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render("item_form", {
            title: "Update Item",
            vendors: results.vendors,
            categories: results.categories,
            item: item,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) {
          return next(err);
        }
        res.redirect(theitem.url);
      });
    }
  },
];
