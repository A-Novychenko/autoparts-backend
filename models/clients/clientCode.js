const mongoose = require('mongoose');

const { Schema } = mongoose;

const clientCodeSchema = new Schema(
  {
    // Напр., "clientCode_25"
    name: { type: String, required: true, unique: true, index: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false },
);

module.exports =
  mongoose.models.ClientCode || mongoose.model('ClientCode', clientCodeSchema);
