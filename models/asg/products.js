const { Schema, model } = require('mongoose');

const ASGProductSchema = new Schema(
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
    price_currency_980: { type: String, required: true },
    price_type_1_currency_980: { type: String, required: true },
    price_type_2_currency_980: { type: String, required: true },
    count_warehouse_3: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

const ASGProduct = model('ASGProduct', ASGProductSchema);

module.exports = ASGProduct;
