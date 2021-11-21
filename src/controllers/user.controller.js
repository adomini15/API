const User = require('../models/User')
const Task = require('../models/Task')
const handleErrors = require('../utils/Errors/HandleErrors')

// GET /users
module.exports.index = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ users })
  } catch (error) {
    const errors = handleErrors(error);

    res.status(400).json({ message: "An error occurred to find 'users'", errors})
  }
}

// GET /users/:id
module.exports.show = async (req, res) => {
  const { id: userID } = req.params;

  try {
    const user = await User.findById(userID)

    if(!user) {
      throw new Error('Resource not found')
    }

    res.status(200).json({ user })
  } catch (error) {
    const errors = handleErrors(error);

    res.status(404).json({ errors})
  }
}

// UPDATE /users/:id
module.exports.update = async (req, res) => {
  const { id: userID } = req.params;

  try {
    const user = await User.findById(userID) 

    user.email = req.body.email == undefined ? user.email : req.body.email ;
    user.password = req.body.password == undefined ? user.password : req.body.password;
 
    user.save();

    res.status(200).json({ user: userID, message: 'User updated successfully' })
  } catch (error) {
    const errors = handleErrors(error);

    res.status(400).json({ message: "Resource not updated", errors})
  }
}

// DELETE /users/:id
module.exports.delete = async (req, res) => {
  const { id: userID } = req.params;

  try {
    const user = await User.findById(userID)

    await user.remove()

    res.status(200).json({ user: userID })
  } catch (error) {
    const errors = handleErrors(error);

    res.status(400).json({ message: "Resource not deleted", errors})
  }
}

// user-task (1:N) relationship

// GET /users/:id/tasks

module.exports.tasks_index = async (req, res) => {
  const { id } = req.params;

  try {
    
    const tasks = await User.findById(id).populate({
      path: 'tasks'
    }).select('-createdAt -updatedAt');
    
    res.status(200).json({ tasks })
  } catch (error) {
    res.status(404).json({ message: 'Tasks Not Found'})
  }
}

// GET /users/:id/tasks/:task
module.exports.tasks_show = async (req, res) => {
  const { id: user, task_id } = req.params;

  try {

    const userExists = await User.exists({ _id: user });

    if(!userExists) {
      throw new Error('User not existing')
    }

    const task = await Task.findOne({
      _id: task_id,
      user
    })

    if(!task) {
      throw new Error('Task not found')
    }

    res.status(200).json({ message: `Task found successfully`, task})  

  } catch (error) {

    const errors = handleErrors(error);

    res.status(404).json({ errors})
  }
}

// CREATE /users/:id/tasks
module.exports.tasks_create = async (req, res) => {
  const { id: user } = req.params;

  try {

    const userExists = await User.exists({ _id: user });

    if(!userExists) {
      throw new Error('User not existing')
    }

    const task = await Task.create({ ...req.body, user })

    res.status(201).json({ message: `Task created successfully`, task, user})  
  } catch (error) {
    const errors = handleErrors(error)
    res.status(403).json({ errors })
  }
}

// UPDATE /users/:id/tasks/:task

module.exports.tasks_update = async (req, res) => {
  const { id: user, task_id } = req.params;

  try {
    const userExists = await User.exists({ _id: user });

    if(!userExists) {
      throw new Error('User not existing')
    }

    const task = await Task.updateOne({
      _id: task_id,
      user
    }, {
      ...req.body
    }, {
      new: true
    })

    if(!task) {
      throw new Error('Task not existing')
    }

    res.status(200).json({ message: `Task updated successfully`, task})

  } catch (error) {
    const errors = handleErrors(error)
    res.status(403).json({ errors })
  }
}

// DELETE /users/:id/tasks/:task
module.exports.tasks_delete = async (req, res) => {
  const { id: user, task_id } = req.params;

  try {

    const userExists = await User.exists({ _id: user });

    if(!userExists) {
      throw new Error('User not existing')
    }

    const task = await Task.findOne({
      _id: task_id,
      user
    })

    if(!task) {
      throw new Error('Task not existing')
    }

    task.remove()

    res.status(200).json({ message: `Task deleted successfully`, task})  

  } catch (error) {

    const errors = handleErrors(error);

    res.status(404).json({ errors})
  }
}