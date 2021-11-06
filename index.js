const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { validatedAuth } = require('./src/middlewares/auth.middleware')

// .env file management
require('dotenv').config()

const app = express()

const PORT = 3000;

// routers
const taskRouter = require('./src/routes/task.router')
const userRouter = require('./src/routes/user.router')
const authRouter = require('./src/routes/auth.router')

// middlewares
app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))


// routes

app.use('/', authRouter)
app.use('/tasks', taskRouter)
app.use('/users', validatedAuth, userRouter)

app.get('/', validatedAuth, (req, res) => {
  res.json({ message: 'WELCOME'})
})


// mongoose

mongoose.set('runValidators', true)

mongoose.connect(process.env.DB_CONNECTION)
.then(() => {
  // Up
  app.listen(PORT, () => {
    console.log(`Escuchando en http://localhost:${PORT}`)
  })  
})
.catch((err) => {
  console.log(`Error DB: ${err}`)
})

