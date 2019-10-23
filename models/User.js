const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },

  forums: [
    {
      forum: {
        type: Schema.Types.ObjectId,
        ref: 'forum'
      }
    }
  ]
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
