const jwt = require('jsonwebtoken')

module.exports.validatedAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (token) {
      const authenticated = jwt.verify(token, process.env.SECRET_KEY)

      if (authenticated) {
        return next()
      }

    }

    throw new Error('Unauthenticated user')

  } catch (error) {

    res.setHeader('WWW-Authenticate', 'Bearer');
    res.status(401).json({ message: error.message })
  }
}