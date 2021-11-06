const mongoose = require('mongoose')
const LoginError = require('../Errors/LoginError')

module.exports = (error) => {
  const errors = {};
  

  if(error instanceof LoginError) {
    errors['email'] = error.message.email;
    errors['password'] = error.message.password;

    return errors;
  }

  if(error instanceof mongoose.Error.ValidationError) {
    Object.values(error.errors).forEach(({properties: props}) => {
      errors[props.path] = props.message
    })

    return errors;
  }

  return { error: error.message };
}