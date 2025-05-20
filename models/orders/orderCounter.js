const { Schema, model } = require('mongoose');

const orderCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const OrderCounter = model('OrderCounter', orderCounterSchema);

module.exports = OrderCounter;
