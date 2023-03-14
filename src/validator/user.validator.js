const Joi = require('joi') 

const UserValidator = { 
  userRegister: Joi.object().keys({ 
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password:Joi.string().min(6).alphanum().required(), 
    role:Joi.string().required(),
  }),
}; 

module.exports = UserValidator;