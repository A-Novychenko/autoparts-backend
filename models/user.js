const { Schema, model } = require('mongoose');
const Joi = require('joi');

const {
  handleMongooseError,
  userRegexp: { loginRegexp, nameRegexp, passwordRegexp },
} = require('../helpers');

const userSchema = new Schema(
  {
    name: {
      type: String,
      min: [2, 'Name must have minimum 2 characters'],
      max: [32, 'Name must have minimum 32 characters'],
      required: [true, 'Set name for user'],
    },
    login: {
      type: String,
      min: [5, 'Login must have minimum 5 characters'],
      max: [10, 'Login must have minimum 10 characters'],
      required: [true, 'Set login for user'],
      unique: true,
    },
    password: {
      type: String,
      min: [8, 'Password must have minimum 8 characters'],
      max: [64, 'Password must have minimum 64 characters'],
      required: [true, 'Set password for user'],
      // match: 'regular expression',
    },
    role: {
      type: String,
      enum: ['admin', 'manager'],
      required: [true, 'Select a user role'],
    },
    status: {
      type: String,
      enum: ['enabled', 'disabled'],
      required: true,
      default: 'disabled',
    },
    accessToken: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      default: '',
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(32).pattern(nameRegexp).required(),
  login: Joi.string().min(5).max(10).pattern(loginRegexp).required(),
  password: Joi.string().min(8).max(64).pattern(passwordRegexp).required(),
  role: Joi.string().valid('admin', 'manager').required(),
});

const loginSchema = Joi.object({
  login: Joi.string().min(5).max(10).pattern(loginRegexp).required(),
  password: Joi.string().min(8).max(64).pattern(passwordRegexp).required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).max(32).pattern(nameRegexp).required(),
  login: Joi.string().min(5).max(10).pattern(loginRegexp).required(),
  password: Joi.string().min(8).max(64).pattern(passwordRegexp).required(),
  role: Joi.string().valid('admin', 'manager').required(),
  status: Joi.string().valid('enabled', 'disabled').required(),
});

const changeStatus = Joi.object({
  status: Joi.string().valid('enabled', 'disabled').required(),
  id: Joi.string().required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateSchema,
  changeStatus,
};

const User = model('user', userSchema);

module.exports = { User, schemas };
