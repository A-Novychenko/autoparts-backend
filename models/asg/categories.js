const { Schema, model } = require('mongoose');
const Joi = require('joi');

const ASGCategorySchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    parent_id: { type: Number, required: true },
    img: { type: String, default: '' },
    margin: { type: Number, default: 10 },
    hasChildren: { type: Boolean, default: false },
    hasProducts: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);

const schemas = {};

const ASGCategory = model('ASGCategory', ASGCategorySchema);

module.exports = { ASGCategory, schemas };
