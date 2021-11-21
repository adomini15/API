const Task = require('../models/Task')
const handleErrors = require('../utils/Errors/HandleErrors')


// GET /tasks
module.exports.index = async (req, res) => {
  try {
    
    const tasks = await Task.find();
    
    res.status(200).json({ tasks })
  } catch (error) {
    const errors = handleErrors(error);
    res.status(404).json({ message: 'Tasks Not Found', errors})
  }
}

// GET /tasks/:id
module.exports.show = async (req, res) => {
  const { id: taskID } = req.params;
  
  try {
    const task = await Task.findById(taskID);

    if(!task) {
      throw new Error('Task not found');
    }

    res.status(200).json({ task })   

  } catch (error) {
    const errors = handleErrors(error);
    res.status(404).json({ errors})
  }
}
