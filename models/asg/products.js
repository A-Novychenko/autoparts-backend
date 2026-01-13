const Joi = require('joi');
const { Schema, model } = require('mongoose');

const ASGProductSchema = new Schema(
  {
    id: { type: Number, required: true },
    category: { type: String, required: true },
    category_id: { type: Number, required: true },
    brand: { type: String, required: true },
    article: { type: String, required: true },
    tecdoc_article: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price_currency_980: { type: String, required: true },
    count_warehouse_3: { type: String, required: true },
    count_warehouse_4: { type: String, required: true },
    banner: { type: Boolean, default: false, required: true },
    sale: { type: Boolean, default: false, required: true },
    price_promo: { type: String, default: null },
    search_index: { type: String, default: null },
    manualDescription: { type: String, default: null },
    groupName: { type: String, default: null },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
  },
  { versionKey: false, timestamps: false },
);

const getCmsProduct = Joi.object({
  article: Joi.string().required(),
});

const updProductGroupSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .allow(null) // Позволяет передавать null
    .required(),
});

const schemasProducts = {
  getCmsProduct,
  updProductGroupSchema,
};

const ASGProduct = model('ASGProduct', ASGProductSchema);

module.exports = { ASGProduct, schemasProducts };
