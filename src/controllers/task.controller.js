const Task = require('../models/Task')
const handleErrors = require('../utils/Errors/HandleErrors')


// GET /tasks
module.exports.index = async (req, res) => {
  try {
    
    const tasks = await Task.find();
    
    res.status(200)
    res.json({ tasks })
  } catch (error) {
    res.status(404)
    res.json({ message: 'Tasks Not Found'})
  }
}

// GET /tasks/:id
module.exports.show = async (req, res) => {
  const { id: taskID } = req.params;
  
  try {
    const task = await Task.findById(taskID)

    res.status(200)
    res.json({ task })   

  } catch (error) {
    res.status(404)
    res.json({ message: 'Task Not Found'})
  }
}
