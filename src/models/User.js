const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail, isAlphanumeric } = require('validator');
const LoginError = require('../utils/Errors/LoginError');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email required'],
    validate: [isEmail, `Invalid format email`],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password required'],
    minlength: [9, 'Min Allowed: 9'],
    maxlength: [15, 'Max Allowed: 15'],
    validate: [isAlphanumeric, `Only alphanumeric characters`]
  },
  tasks: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true })

// Hooks

async function encrypt(value) {
  const salt = await bcrypt.genSalt();
  const encryptedValue = await bcrypt.hash(value, salt);

  return encryptedValue;

}

// On create and update post-validate phase.
userSchema.pre('save', async function (next) {

  try {
    if (this.isNew) {
      this.password = await encrypt(this.password)
    } else {
      if (this.isModified('password')) {
        this.password = await encrypt(this.password)
      }

    }

    next()
  } catch (error) {
    throw error;
  }
})

userSchema.pre('remove', async function (next) {
  try {
    const tasks = await mongoose.model('Task').deleteMany({ user: this._id })

    next();
  } catch (error) {
    throw error;
  }
})

// Login static method
userSchema.statics.login = async (email, password) => {

  try {
    const errors = {}

    const user = await User.findOne({ email })


    if (user) {
      const auth = await bcrypt.compare(password, user.password)

      if (auth) {
        return user;
      }

      errors['password'] = `Incorrect Password`

    } else {
      errors['email'] = `Email not found`
    }


    throw new LoginError({ ...errors })

  } catch (error) {
    throw error;
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;