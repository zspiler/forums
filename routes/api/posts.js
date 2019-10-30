const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const ObjectId = require('mongodb').ObjectID;

const Forum = require('../../models/Forum');
const Post = require('../../models/Post');
const User = require('../../models/User');

// @route  POST api/posts/:forumId
// @desc   Create a post
// @access Private

router.post(
  '/:forumId',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('title', 'Title can not be more than 200 characters long').isLength(
        {
          max: 200
        }
      ),
      check('text', 'Text is required')
        .not()
        .isEmpty(),
      check(
        'text',
        'Post text can not be more than 42000 characters long'
      ).isLength({
        max: 42000
      })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');

    const { title: title, text: text } = req.body;

    try {
      // CHECK IF FORUM EXISTS
      const forum = await Forum.findById(req.params.forumId);
      if (!forum) return res.status(400).json({ msg: 'Forum not found.' });

      // CREATE POST
      let post = new Post({
        title: title,
        text: text,
        forum: req.params.forumId,
        forumName: forum.name,
        user: ObjectId(req.user.id),
        username: user.username
      });

      let postId;
      await post.save((err, post) => {
        postId = post._id;
      });

      // ADD POST ID TO FORUM
      forum.posts.unshift({ post: postId });
      await forum.save();

      res.json(post);
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res.status(400).json({ msg: 'Forum not found.' });
      }
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  GET api/posts
// @desc   Get 30 most recent posts
// @access Public

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({
        date: -1
      })
      .limit(30);
    res.send(posts);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Forum not found.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  GET api/posts/forum/:forumId
// @desc   Get all posts on a forum
// @access Public

router.get('/forum/:forumId', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) return res.status(400).json({ msg: 'Forum not found.' });

    const posts = await Post.find({ forum: req.params.forumId }).sort({
      date: -1
    });
    res.send(posts);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Forum not found.' });
    }
    res.status(500).send('Server Error');
  }
});

// @route  GET api/posts/:forumId/:postId
// @desc   Get post by ID
// @access Public

router.get('/:forumId/:postId', async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.forumId);
    if (!forum) return res.status(400).json({ msg: 'Resource not found.' });

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(400).json({ msg: 'Resource not found.' });
    }

    res.send(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Resource not found.' });
    }
    return res.status(500).send('Server Error');
  }
});

// @route  GET api/posts/:postId
// @desc   Delete post
// @access Public

router.delete('/:postId', auth, async (req, res) => {
  try {
    // Check if Forum with DB id exists
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post does not exist' });
    }
    // Check if user owns this forum
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    await Post.findOneAndRemove({ _id: req.params.postId });

    res.json({ msg: 'Post deleted' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Post not found.' });
    }
    console.log(err.message);
    res.status(500, { msg: 'Server Error' });
  }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private

router.put('/like/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      // return res.status(400).json({ msg: 'Post already liked' });
      return res.status(400).send({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   api/posts/like/:postId
// @desc   Unlike a post
// @access Private

router.put('/unlike/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ==
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/// @route  POST api/posts/comment/:postId
// @desc   Comment on a post
// @access Private

router.post(
  '/comment/:postId',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty(),
      check(
        'text',
        'Comment text can not be more than 1000 characters long'
      ).isLength({
        max: 1000
      })
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.postId);
      console.log(req.user.id);

      const newComment = {
        text: req.body.text,
        name: user.username,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route  DELETE api/posts/comment/:postId/:commentId
// @desc   Delete a comment
// @access Private

router.delete('/comment/:postId/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    // Pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.commentId
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route  PUT api/posts/like/:postId/:commentId
// @desc   Like a comment
// @access Private

router.put('/like/:postId/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const { comments } = post;

    let comment = null;
    comments.map(comment_ => {
      if (comment_.id == req.params.commentId) {
        comment = comment_;
      }
    });

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if the comment has already been liked
    if (
      comment.likes.filter(like => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Comment already liked' });
    }

    comment.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.comments);
    return;
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Resource not found' });
    }
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   api/posts/unlike/:postId/:commentId
// @desc   Unlike a post
// @access Private

router.put('/unlike/:postId/:commentId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const { comments } = post;

    let comment = null;
    comments.map(comment_ => {
      if (comment_.id == req.params.commentId) {
        comment = comment_;
      }
    });

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if the comment has already been liked
    if (
      comment.likes.filter(like => like.user.toString() === req.user.id)
        .length == 0
    ) {
      return res.status(400).json({ msg: 'Comment has not yet been liked' });
    }

    // Get remove index
    const removeIndex = comment.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    comment.likes.splice(removeIndex, 1);
    await post.save();

    res.json(comment.likes);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route  GET api/posts/followed
// // @desc   Get all posts from followed forums
// // @access Private

// TODO: CAN'T HAVE AWAIT IN MAP

// router.get('/followed', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     const posts = []

//     user.forums.map(userForum => {
//       const forum = await Forum.findById(req.params.forumId);
//       if (!forum) return res.status(400).json({ msg: 'Forum not found.' });
//       const forumPosts = await Post.find({ forum: userForum }).sort({
//             date: -1
//       });
//       posts.concat(forumPosts);
//     });
//     return res.send(posts);

//   } catch (err) {
//     console.log(err.message);
//     if (err.kind == 'ObjectId') {
//       return res.status(400).json({ msg: 'Forum not found.' });
//     }
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
