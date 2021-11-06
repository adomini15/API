const express = require('express')
const taskRouter = express.Router();
const taskController = require('../controllers/task.controller')

taskRouter.get('/', taskController.index)
taskRouter.get('/:id', taskController.show)


module.exports = taskRouter;