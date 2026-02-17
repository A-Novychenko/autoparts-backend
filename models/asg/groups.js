const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../../helpers');

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true, // Для быстрого поиска по URL
    },
    // Ссылка на непосредственного родителя (для построения дерева в админке)
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    // Массив всех родителей до текущего элемента (для хлебных крошек и поиска товаров)
    ancestors: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'Group',
        },
        name: String,
        slug: String,
      },
    ],
    img: { type: String, default: '' },
    margin: { type: Number, required: true },
    isVisible: { type: Boolean, default: false },
  },
  { versionKey: false, timestamps: true },
);

groupSchema.post('save', handleMongooseError);

// Индекс для быстрого поиска подкатегорий
groupSchema.index({ parent: 1 });
groupSchema.index({ 'ancestors._id': 1 });

const objectId = Joi.string().hex().length(24);

const addPGroupSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().allow(null).optional(),

  slug: Joi.string().trim().lowercase().required(),

  parent: objectId.allow(null).optional(),

  ancestors: Joi.array()
    .items(
      Joi.object({
        _id: objectId.required(),
        name: Joi.string().required(),
        slug: Joi.string().required(),
      }),
    )
    .optional(),

  img: Joi.string().allow('').optional(),

  margin: Joi.number().required(),

  isVisible: Joi.boolean().optional(),
});

// Если ancestors не передаёшь с клиента
//     (часто они считаются на бэке — рекомендую именно так)

//  const addPGroupSchema = Joi.object({
//   name: Joi.string().trim().required(),
//   slug: Joi.string().trim().lowercase().required(),
//   parent: objectId.allow(null).optional(),
//   img: Joi.string().allow('').optional(),
//   margin: Joi.number().required(),
// });

const schemas = { addPGroupSchema };

const Group = model('Group', groupSchema);

module.exports = { Group, schemas };
