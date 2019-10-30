const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ForumSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  followerCount: {
    type: Number,
    required: true,
    default: 0
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      }
    }
  ],
  posts: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: 'post'
      }
    }
  ]
});

Forum = mongoose.model('forum', ForumSchema);
module.exports = Forum;
