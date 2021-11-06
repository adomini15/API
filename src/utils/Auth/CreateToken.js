const jwt = require('jsonwebtoken')

function createToken (userId) {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 * 3});

  return token;
}

module.exports = createToken;