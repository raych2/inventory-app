#! /usr/bin/env node

console.log(
  "This script populates some test items, vendors, and categories to the database."
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async");
const Item = require("./models/item");
const Vendor = require("./models/vendor");
const Category = require("./models/category");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const vendors = [];
const categories = [];
const items = [];

function vendorCreate(name, description, cb) {
  vendorDetail = { name: name, description: description };

  const vendor = new Vendor(vendorDetail);

  vendor.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Vendor: " + vendor);
    vendors.push(vendor);
    cb(null, vendor);
  });
}

function categoryCreate(name, description, cb) {
  categoryDetail = { name: name, description: description };

  const category = new Category(categoryDetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemCreate(name, vendor, description, category, price, inStock, cb) {
  itemDetail = {
    name: name,
    vendor: vendor,
    description: description,
    category: category,
    price: price,
    inStock: inStock,
  };

  const item = new Item(itemDetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

//create categories, vendors, and items
function createVendors(cb) {
  async.parallel(
    [
      function (callback) {
        vendorCreate(
          "Tom Nook",
          "Shop owner, real estate developer, and part-time crook",
          callback
        );
      },
      function (callback) {
        vendorCreate(
          "David Rose",
          "Style icon. Owner of Rose Apothecary",
          callback
        );
      },
      function (callback) {
        vendorCreate("Test Vendor", "Description of test vendor", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        categoryCreate("Houseware", "Small household items", callback);
      },
      function (callback) {
        categoryCreate("Skin Care", "Any skincare products", callback);
      },
      function (callback) {
        categoryCreate(
          "Test Category",
          "Description of test category",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "Plates",
          vendors[0],
          "Dinnerware",
          categories[0],
          80,
          20,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Barware set",
          vendors[0],
          "Glasses, tools, and accessories",
          categories[0],
          100,
          25,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Coffee mug",
          vendors[0],
          "Coffee mug",
          categories[0],
          15,
          50,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Face moisturizer",
          vendors[1],
          "A lightweight gel cream that works to keep skin moisturized all day long",
          categories[1],
          50,
          80,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Test Item",
          vendors[2],
          "Description for test item",
          categories[2],
          200,
          50,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createVendors, createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("Products: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
