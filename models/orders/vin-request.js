const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../../helpers');
const VinCounter = require('./vinCounter'); // Підключаємо модель лічильника

const vinRequestSchema = new Schema(
  {
    vinCode: {
      type: String,
      min: [17, 'vinCode must have minimum 17 characters'],
      max: [17, 'vinCode must have minimum 17 characters'],
      required: [true, 'Set VINCODE !'],
    },
    name: { type: String, default: '' },
    brand: { type: String, default: '' },
    model: { type: String, default: '' },
    engine: { type: String, default: '' },
    fuel: { type: String, default: '' },
    year: { type: String, default: '' },
    phone: {
      type: String,
      required: [true, 'Set phone !'],
    },
    message: { type: String, default: '' },

    number: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['new', 'in-progress', 'rejected', 'done'],
      default: 'new',
    },

    comment: { type: String, default: '' },
  },
  { versionKey: false, timestamps: true },
);

// 🟢 Хук для автоінкременту номера
vinRequestSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await VinCounter.findOneAndUpdate(
        { name: 'vinRequest' },
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

vinRequestSchema.post('save', handleMongooseError);

const addVinRequestSchema = Joi.object({
  vinCode: Joi.string()
    .length(17)
    .pattern(/^[A-HJ-NPR-Z0-9]{17}$/i)
    .required()
    .messages({
      'string.length': 'VIN-код має містити рівно 17 символів',
      'string.pattern.base':
        'VIN-код може містити лише латинські літери та цифри',
    }),

  phone: Joi.string().min(5).max(25).required().messages({
    'string.min': 'Телефон має містити щонайменше 5 символів',
    'string.max': 'Телефон має містити не більше 25 символів',
  }),

  name: Joi.string().allow('').optional(),
  brand: Joi.string().allow('').optional(),
  model: Joi.string().allow('').optional(),
  engine: Joi.string().allow('').optional(),
  fuel: Joi.string().allow('').optional(),
  year: Joi.string().allow('').optional(),
  message: Joi.string().allow('').optional(),

  //   //   status: Joi.string()
  //   //     .valid('new', 'in-progress', 'rejected', 'done')
  //   //     .optional()
  //   //     .messages({
  //   //       'any.only': 'Неприпустиме значення статусу',
  //   //     }),
});

const schemasVinRequest = {
  addVinRequestSchema,
};

const VinRequest = model('vinRequest', vinRequestSchema);

module.exports = { VinRequest, schemasVinRequest };
