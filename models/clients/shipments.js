const mongoose = require('mongoose');
const { handleMongooseError } = require('../../helpers');
const Joi = require('joi');

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
    company: { type: String, default: null },
    deliveryPayment: {
      type: String,
      enum: ['client', 'shop', 'clientBank', 'shopBank'],
      default: 'client',
    },
  },
  { versionKey: false, timestamps: true },
);

shipmentSchema.post('save', handleMongooseError);

const addShipmentSchema = Joi.object({
  client: Joi.string().hex().length(24).required(), // ObjectId
  name: Joi.string().min(2).max(64).required(),
  phone: Joi.string().required(),
  delivery: Joi.string().valid('pickup', 'post').default('post'),
  deliveryCity: Joi.string().allow('', null).default(''),
  postOffice: Joi.string().allow('', null).default(''),
  payment: Joi.string()
    .valid('card', 'cash', 'prepayment', 'cod')
    .default('prepayment'),
  deliveryPayment: Joi.string()
    .valid('client', 'shop', 'clientBank', 'shopBank')
    .default('client'),
  company: Joi.string().allow(null, ''),
});

const updShipmentSchema = Joi.object({
  name: Joi.string().min(2).max(64).required(),
  phone: Joi.string().required(),
  delivery: Joi.string().valid('pickup', 'post').default('post'),
  deliveryCity: Joi.string().allow('', null).default(''),
  postOffice: Joi.string().allow('', null).default(''),
  payment: Joi.string()
    .valid('card', 'cash', 'prepayment', 'cod')
    .default('prepayment'),
  deliveryPayment: Joi.string()
    .valid('client', 'shop', 'clientBank', 'shopBank')
    .default('client'),
  company: Joi.string().allow(null, ''),
});

const Shipment = model('shipment', shipmentSchema);

const schemasShipment = {
  addShipmentSchema,
  updShipmentSchema,
};

module.exports = { Shipment, schemasShipment };
