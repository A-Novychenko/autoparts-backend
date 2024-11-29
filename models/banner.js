const { Schema, model } = require('mongoose');
const Joi = require('joi');

const BannerSchema = new Schema(
  {
    id: { type: Number, required: true },
    cid: { type: String, required: true },
    category: { type: String, required: true },
    category_id: { type: Number, required: true },
    brand: { type: String, required: true },
    article: { type: String, required: true },
    tecdoc_article: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: String, required: true },
    price_sale: { type: String, required: true },
    count_warehouse_3: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

const addBanner = Joi.object({
  //   id: Joi.number().required(),
});

const schemasBanner = {
  addBanner,
};

const Banner = model('banner', BannerSchema);

module.exports = { Banner, schemasBanner };
