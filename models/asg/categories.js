const { Schema, model } = require('mongoose');

const ASGCategorySchema = new Schema(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    parent_id: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true },
);

const ASGCategory = model('ASGCategory', ASGCategorySchema);

module.exports = ASGCategory;
