const { Schema, model } = require('mongoose');

const ASGImageSchema = new Schema(
  {
    product_id: {
      type: Number,
      required: true,
      unique: true,
    },
    images: {
      type: [String],
      required: true,
    },
    original_images: {
      type: [String],
      required: true,
    },
  },
  { versionKey: false, timestamps: true },
);

const ASGImage = model('ASGImage', ASGImageSchema);

module.exports = ASGImage;
