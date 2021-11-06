const User = require('../models/User')
const createToken = require('../utils/Auth/CreateToken')
const handleErrors = require('../utils/Errors/HandleErrors')

// POST /login
module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password)

    const token = createToken(user.id)

    res.cookie('jwt', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3
    })

    res.status(200)
    res.json({
      user: user.id,
      message: 'User authenticated correctly'
    })

  } catch (error) {

    const errors = handleErrors(error)
    res.status(400)
    res.json({ errors })
  }
}

// POST /signup
module.exports.signup = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201)
    res.json({ user, message: 'User created successfully'})
  } catch (error) {
    const errors = handleErrors(error)
    res.status(400)
    res.json({ errors })
  }
}

// POST /logout
module.exports.logout = async (req, res) => {
  try {
    res.cookie('jwt', '',{ maxAge: 0})

    res.status(200)
    res.json({message: 'User logout successfully'})

  } catch (error) {
    const errors = handleErrors(error)
    res.status(400)
    res.json({ errors })
  }
}