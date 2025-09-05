const mongoose = require('mongoose');
const { handleMongooseError } = require('../../helpers');

const { Schema, model } = mongoose;

const shipmentSchema = new Schema(
  {
    client: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    name: {
      type: String,
      minlength: [2, 'Name must have minimum 2 characters'],
      maxlength: [64, 'Name must have maximum 64 characters'],
      required: [true, 'Set name for user'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone !'],
    },
    delivery: {
      type: String,
      enum: ['pickup', 'post'],
      default: 'pickup',
    },
    deliveryCity: { type: String, default: '' },
    postOffice: { type: String, default: '' },
    payment: {
      type: String,
      enum: ['card', 'cash', 'prepayment', 'cod'],
      default: 'card',
    },
  },
  { versionKey: false, timestamps: true },
);

shipmentSchema.post('save', handleMongooseError);

const Shipment = model('shipment', shipmentSchema);

module.exports = { Shipment, schemasClient: {} };
