const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  scope: {
    type: String,
    required: true,
  },
});

const ShopModel = mongoose.model("shop", shopSchema);

module.exports = ShopModel;
