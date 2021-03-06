const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const User = require('../../model/User')
const Profile = require('../../model/Profile')
const Post = require('../../model/Post')
const auth = require('../../middleware/auth')

//@route api/posts
// @desc to add post

router.post(
    '/',
    auth,
    check('text', 'Text is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
        });
  
        const post = await newPost.save();
  
        res.json(post);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

  // @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/',async (req, res) => {
    try {
      const posts = await Post.find().sort({ date: -1 });
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
// @route api/posts/:id
// @desc to get post by Id

router.get('/:id',async(req, res) => {

  try {
    const foundPost = await Post.findById(req.params.id);
    console.log("userDetails",foundPost);
    if(foundPost)
    res.json(foundPost);
    else
    res.status(404).json({msg:"Post Not Found"});

  } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
  }
})

// @route api/posts/:id
// @desc delete post by id

router.delete('/:id',auth,async(req, res) => {

    try {
        const foundPost = await Post.findById(req.params.id);
      console.log("userDetails",foundPost);

      //check user who is deleting the post owns the 
      //post bcos only he should be able to delete it.
     if(foundPost.user.toString()!==req.user.id)
     res.status(401).json({msg:"User not authorized"});
     else{
      if(foundPost){
        await foundPost.remove();
        res.json({msg:"Post Deleted Successfully!!"});
      }
      else
      res.status(404).json({msg:"Post Not Found"});
    }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
  })

  // @route api/posts/like/:id
// @desc like a post by id

router.put('/like/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  console.log("likes",post.likes,req.user.id);
      // Check if the post has already been liked
      //some used to check atleast one condition is passed
      if (post.likes.some((like) => like.user.toString() === req.user.id)) {
        return res.status(400).json({ msg: 'Post already liked' });
      }
  
      post.likes.unshift({ user: req.user.id });
  
      await post.save();
  
      return res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  // @route api/posts/unlike/:id
// @desc unlike a post by id

router.put('/unlike/:id', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const oldLikes = post.likes.length;
      // Check if the post has already been liked
      post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id)
      
      if(post.likes.length===oldLikes)
        return res.status(400).json({msg:"Post has not been liked yet"});
         else
        {
            await post.save()
            return res.json({msg:"Disliked"})
        }
        
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  //@route api/posts/comment/:id
// @desc comment on a post

router.post(
    '/comment/:id',
    auth,
    check('text', 'Text is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
          text: req.body.text,
          name: user.name,
          avatar: user.avatar,
          user: req.user.id
        };
        if(!post)
        return res.status(404).json({msg:"Post not found"})
        else{
        post.comments.unshift(newComment)
        await post.save();
        res.json(post.comments);
        }
      } catch (err) {
        console.error(err.message);
        if(err.kind=="ObjectId")
        return res.status(404).json({msg:"Post not found"})
        res.status(500).send('Server Error');
      }
    }
  );

   //@route api/posts/comment/:id/:comment_id
// @desc delete comment on a post by post id by comment id

router.delete('/comment/:id/:comment_id',auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if(!post)
      return res.status(400).json({msg:"Post not found"})
  
      // Pull out comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );
      // Make sure comment exists
      if (!comment) {
        return res.status(404).json({ msg: 'Comment does not exist' });
      }
      // Check user
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
  
      post.comments = post.comments.filter(
        ({ id }) => id !== req.params.comment_id
      );
  
      await post.save();
  
      return res.json({msg:"Deleted successfully"});
    } catch (err) {
      console.error(err.message);
      if(err.kind=="ObjectId")
      return res.status(400).json({msg:"Post not found"})
      return res.status(500).send('Server Error');
    }
  });

module.exports = router;