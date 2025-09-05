const mongoose = require('mongoose');
const { handleMongooseError } = require('../../helpers');
const ClientCode = require('./clientCode');

const { Schema, model } = mongoose;

const clientSchema = new Schema(
  {
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
    email: { type: String, default: '' },

    shipment: { type: Schema.Types.ObjectId, ref: 'shipment' },

    login: {
      type: String,
      required: [true, 'Set login for user'],
      unique: true,
      index: true,
    },
    password: {
      type: String,
      default: '',
    },
    // Без default: '' — иначе unique сломается на пустых значениях
    clientCode: {
      type: String,
      unique: true,
      index: true,
    },
  },
  { versionKey: false, timestamps: true },
);

// Генерация clientCode только при создании; счётчик обнуляется каждый год (Europe/Kyiv)
clientSchema.pre('save', async function (next) {
  if (!this.isNew || this.clientCode) return next();

  try {
    // Берём последние 2 цифры года в часовом поясе Киева
    const year2 = new Intl.DateTimeFormat('uk-UA', {
      timeZone: 'Europe/Kyiv',
      year: '2-digit',
    }).format(new Date()); // напр., '25'

    // Уникальный ключ счётчика для года: clientCode_25
    const counter = await ClientCode.findOneAndUpdate(
      { name: `clientCode_${year2}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );

    const serial = String(counter.seq).padStart(4, '0'); // 0001
    const series = 'AM';

    this.clientCode = `${series}${year2}${serial}`; // AM250001
    next();
  } catch (err) {
    next(err);
  }
});

clientSchema.post('save', handleMongooseError);

const Client = mongoose.models.client || model('client', clientSchema);

module.exports = { Client, schemasClient: {} };
