const { Schema, model } = require('mongoose');

const vinCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const VinCounter = model('VinCounter', vinCounterSchema);

module.exports = VinCounter;
