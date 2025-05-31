const { Schema, model } = require('mongoose');

const callbackCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const CallbackCounter = model('CallbackCounter', callbackCounterSchema);

module.exports = CallbackCounter;
