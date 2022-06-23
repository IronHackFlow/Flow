const Joi = require('@hapi/joi')

const registerValidation = data => {
  const schema = {
    username: Joi.string().alphanum().min(5).max(30).required(),
    email: Joi.string().min(6).max(30).required().email(),
    password: Joi.string().min(6).required(),
  }
  return Joi.validate(data, schema)
}

const logInValidation = data => {
  const schema = {
    username: Joi.string().alphanum().required(),
    password: Joi.string().required(),
  }
  return Joi.validate(data, schema)
}

module.exports = {
  registerValidation: registerValidation,
  logInValidation: logInValidation,
}
