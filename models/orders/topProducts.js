const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../../helpers');

const topProductsSchema = new Schema(
  {
    tecdoc_article: { type: String, required: true },
  },
  { versionKey: false, timestamps: true },
);

topProductsSchema.post('save', handleMongooseError);

const addTopProductsSchema = Joi.object({
  tecdoc_article: Joi.string().required(),
});

const schemasTopProduct = {
  addTopProductsSchema,
};

const TopProduct = model('topProduct', topProductsSchema);

module.exports = { TopProduct, schemasTopProduct };
