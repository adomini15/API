const userController = require('../controllers/user.controller')
const express = require('express')
const userRouter = express.Router();

userRouter.get('/', userController.index);
userRouter.get('/:id', userController.show);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

// user-task (1:N) relationship
userRouter.get('/:id/tasks', userController.tasks_index);
userRouter.post('/:id/tasks', userController.tasks_create);
userRouter.get('/:id/tasks/:task_id', userController.tasks_show);
userRouter.put('/:id/tasks/:task_id', userController.tasks_update);
userRouter.delete('/:id/tasks/:task_id', userController.tasks_delete);

module.exports = userRouter;