const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title required'],
    minlength: [10, 'Min Allowed: 10'],
    maxlength: [75, 'Max Allowed: 75'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Description required'],
    minlength: [10, 'Min Allowed: 10'],
    maxlength: [85, 'Max Allowed: 85']
  },
  done: {
    type: Boolean,
    required: true,
    default: () => { return false}
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }
}, { timestamps: true})


// Hooks

taskSchema.post('save', async function (task, next) {
  try {

    const user = await mongoose.model('User').findOneAndUpdate({ _id: task.user}, {
      $addToSet: {
        tasks: task
      },
      // $pull: {
      //   tasks: {
      //     $elemMatch: {}
      //   }
      // }
    }, {
      runValidators: false
    });


    next()

  } catch (error) {
    throw error;
  } 
})

taskSchema.pre('remove', async function (next) {
  try {
    const user = await mongoose.model('User').findOneAndUpdate({ _id: this.user}, {
      $pull: {
        tasks: this._id
      }
    }, {
      runValidators: false,
      new: true
    });

    next()

  } catch(error) {
    throw error;
  }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;