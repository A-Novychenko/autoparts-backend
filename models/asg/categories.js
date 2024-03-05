const { Schema, model } = require('mongoose');

const ASGaCategorySchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    parent_id: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true },
);

const ASGCategory = model('ASGCategory', ASGaCategorySchema);

module.exports = ASGCategory;
