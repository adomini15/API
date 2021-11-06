class LoginError extends Error {
  constructor ( data ) {
    super(data)
    this.name = 'Login Error'
    this.message = data;
  }
}

module.exports = LoginError;