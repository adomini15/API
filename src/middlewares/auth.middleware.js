const jwt = require('jsonwebtoken')

module.exports.validatedAuth = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if(token) {
      const authenticated = jwt.verify(token, process.env.SECRET_KEY) 

      if(authenticated) {
        next()
      }
    }

    throw new Error('Unauthenticated user')

  } catch (error) {
    res.status(401);
    res.json({ message: error.message})
  }
}