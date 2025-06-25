const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../../helpers');
const Counter = require('./Counter'); // Підключаємо модель лічильника

const orderSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name !'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone !'],
    },
    email: { type: String, default: '' },
    message: { type: String, default: '' },
    comment: { type: String, default: '' },
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
    products: {
      type: [
        {
          _id: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          id: { type: Number, required: true },
          article: { type: String, required: true },
          brand: { type: String, required: true },
          name: { type: String, required: true },
          img: { type: String, default: '' },
          price: { type: Number, required: true },
          price_promo: { type: Number, default: null },
          quantity: { type: Number, required: true },
          availability: { type: String, required: true },
        },
      ],
      default: [],
    },
    number: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'rejected', 'done'],
      default: 'new',
    },
  },
  { versionKey: false, timestamps: true },
);

// 🟢 Хук для автоінкременту номера
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'order' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      this.number = counter.seq.toString().padStart(4, '0'); // напр. '0001'
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

orderSchema.post('save', handleMongooseError);

const addOrderSchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    'any.required': 'Name is required',
    'string.empty': 'The name cannot be empty',
  }),

  phone: Joi.string().min(5).max(25).required().messages({
    'string.min': 'The phone number must contain at least 5 characters',
    'string.max': 'ТThe phone number must contain no more than 25 characters',
    'any.required': 'Phone is required',
  }),

  email: Joi.string().email().allow('').optional(),

  message: Joi.string().allow('').optional(),

  delivery: Joi.string().valid('pickup', 'post').required().messages({
    'any.only': 'The delivery method must be “pickup” or “post”',
    'any.required': 'Choose a delivery method',
  }),

  deliveryCity: Joi.string().allow('').optional(),

  postOffice: Joi.string().allow('').optional(),

  payment: Joi.string()
    .valid('card', 'cash', 'prepayment', 'cod')
    .required()
    .messages({
      'any.only':
        'The payment method must be one of the following: “card”, "cash", "prepayment", ”cod”',
      'any.required': 'Choose a payment method',
    }),

  number: Joi.string().allow('').optional(),

  status: Joi.string()
    .valid('new', 'in-progress', 'rejected', 'done')
    .optional(),

  products: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().required(),
        id: Joi.number().required(),
        article: Joi.string().required(),
        brand: Joi.string().required(),
        name: Joi.string().required(),
        img: Joi.string().optional(),
        price: Joi.number().required(),
        price_promo: Joi.number().allow(null).optional(),
        quantity: Joi.number().required(),
        availability: Joi.string().allow('').optional(),
      }),
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'The products field must be an array',
      'array.min': 'There must be at least one product in the order',
      'any.required': 'The list of goods is required',
    }),
  captchaToken: Joi.string().allow('').optional(),
});

const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid('new', 'in-progress', 'rejected', 'done')
    .optional(),
  comment: Joi.string().allow('').optional(),
});

const schemasOrder = {
  addOrderSchema,
  updateOrderSchema,
};

const Order = model('order', orderSchema);

module.exports = { Order, schemasOrder };
