const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../../helpers');

const Counter = require('./Counter'); // Підключаємо модель лічильника

const callbackSchema = new Schema(
  {
    phone: {
      type: String,
      required: [true, 'Set phone !'],
    },
    comment: { type: String, default: '' },

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
callbackSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'callback' },
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

callbackSchema.post('save', handleMongooseError);

const addCallbackSchema = Joi.object({
  phone: Joi.string().min(5).max(25).required().messages({
    'string.min': 'The phone number must contain at least 5 characters',
    'string.max': 'ТThe phone number must contain no more than 25 characters',
    'any.required': 'Phone is required',
  }),
});

const updateCallbackSchema = Joi.object({
  status: Joi.string()
    .valid('new', 'in-progress', 'rejected', 'done')
    .optional(),
  comment: Joi.string().allow('').optional(),
});

const schemasCallback = {
  addCallbackSchema,
  updateCallbackSchema,
};

const Callback = model('callback', callbackSchema);

module.exports = { Callback, schemasCallback };
