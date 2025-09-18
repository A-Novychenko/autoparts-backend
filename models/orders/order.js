const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../../helpers');
const Counter = require('./Counter'); // Підключаємо модель лічильника

const orderSchema = new Schema(
  {
    number: { type: String, unique: true },
    status: {
      type: String,
      enum: [
        'new',
        'in-progress',
        'awaiting-payment',
        'processed',
        'sent',
        'reserve',
        'rejected',
        'done',
      ],
      default: 'new',
    },

    client: { type: Schema.Types.ObjectId, ref: 'client' },
    shipment: { type: Schema.Types.ObjectId, ref: 'shipment' },

    message: { type: String, default: '' },
    comment: { type: String, default: '' },

    totalAmount: { type: Number, required: true },
    totalAmountWithDiscount: { type: Number, required: true },
    totalDiscount: { type: Number, required: true },
    products: {
      type: [
        {
          _id: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          id: { type: Number, required: true },
          article: { type: String, required: true },
          brand: {
            type: String,
            default: '',
          },
          name: { type: String, required: true },
          img: { type: String, default: '' },
          comment: { type: String, default: '' },
          supplierPrice: { type: Number, required: true },
          price: { type: Number, required: true },
          price_promo: { type: Number, default: null },
          quantity: { type: Number, required: true },
          availability: { type: String, required: true },
          availabilityLviv: { type: String, required: true },
          availabilityOther: { type: String, default: null },
        },
      ],
      default: [],
    },

    declarationNumber: { type: [String], default: [] },
    isPaid: { type: Boolean, default: false },

    createdBy: { type: String, default: null },
    updatedBy: { type: String, default: null },
  },
  { versionKey: false, timestamps: true },
);

// 🟢 Хук для автоинкремента с форматом YY00001
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      // получаем последние 2 цифры года, например 25
      const year = new Date().getFullYear().toString().slice(-2);

      const counter = await Counter.findOneAndUpdate(
        { name: 'order' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true },
      );

      // формируем номер: 25 + 00001
      this.number = `${year}${counter.seq.toString().padStart(5, '0')}`;

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
    .valid(
      'new',
      'in-progress',
      'awaiting-payment',
      'processed',
      'sent',
      'reserve',
      'rejected',
      'done',
    )
    .optional(),

  totalAmount: Joi.number().required(),
  totalAmountWithDiscount: Joi.number().required(),
  totalDiscount: Joi.number().required(),

  products: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().required(),
        id: Joi.number().required(),
        article: Joi.string().required(),
        brand: Joi.string().allow('').required(),
        name: Joi.string().required(),
        img: Joi.string().optional(),
        price: Joi.number().required(),
        price_promo: Joi.number().allow(null).optional(),
        quantity: Joi.number().required(),
        availability: Joi.string().allow('').optional(),
        availabilityLviv: Joi.string().allow('').optional(),
        availabilityOther: Joi.string().allow(null).optional(),
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
    .valid(
      'new',
      'in-progress',
      'awaiting-payment',
      'processed',
      'sent',
      'reserve',
      'rejected',
      'done',
    )
    .optional(),
  comment: Joi.string().allow('').optional(),
});

const changePaymentStatusOrderSchema = Joi.object({
  isPaid: Joi.boolean(),
});
const chooseShipmentOrderSchema = Joi.object({
  shipmentId: Joi.string().required(),
});

const declarationNumbersOrderSchema = Joi.object({
  declarationNumber: Joi.string().min(14).max(14).required().messages({
    'any.required': 'declarationNumber is required',
    'string.empty':
      'The declarationNumber cannot be empty. It will be has 14 numbers ',
  }),
});

const editingPriceAndQtyOrderSchema = Joi.object({
  quantity: Joi.number().required(),
  price_promo: Joi.number().allow(null).required(),
  productId: Joi.string().required(),
  comment: Joi.string().allow('').optional(),
});

const addProductOrderSchema = Joi.object({
  _id: Joi.string().allow('').optional(),
  id: Joi.number().required(),
  article: Joi.string().required(),
  brand: Joi.string().allow('').required(),
  name: Joi.string().required(),
  img: Joi.string().optional(),
  price: Joi.number().required(),
  price_promo: Joi.number().allow(null).optional(),
  quantity: Joi.number().required(),
  availability: Joi.string().allow('').optional(),
  availabilityLviv: Joi.string().allow('').optional(),
  availabilityOther: Joi.string().allow(null).optional(),
  comment: Joi.string().allow('').optional(),
  supplierPrice: Joi.number().allow(null).optional(),
});

const schemasOrder = {
  addOrderSchema,
  updateOrderSchema,
  declarationNumbersOrderSchema,
  changePaymentStatusOrderSchema,
  chooseShipmentOrderSchema,
  editingPriceAndQtyOrderSchema,
  addProductOrderSchema,
};

const Order = model('order', orderSchema);

module.exports = { Order, schemasOrder };
