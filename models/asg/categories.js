const { Schema, model } = require('mongoose');
const Joi = require('joi');

const ASGCategorySchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    parent_id: { type: Number, required: true },
    img: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);

const getCategory = Joi.object({
  id: Joi.number().required(),
});

const schemas = {
  getCategory,
};

const ASGCategory = model('ASGCategory', ASGCategorySchema);

module.exports = { ASGCategory, schemas };
