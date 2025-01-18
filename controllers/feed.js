const { validationResult } = require("express-validator");

const Post = require("../models/post");

// exports.getPosts = (req, res, next) => {
//   res.status(200).json({
//     posts: [
//       {
//         _id: "1",
//         title: "First Post",
//         content: "This is the first post!",
//         imageUrl: "images/duck.jpg",
//         creator: {
//           name: "John Doe",
//         },
//         createdAt: new Date(),
//       },
//     ],
//   });
// };

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      posts: posts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// New getPost function
exports.getPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Invalid post ID.');
    error.statusCode = 422;
    return next(error);
  }
 
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/duck.jpg", // This is a dummy URL
    creator: { name: "John Doe" },
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // Pass the error to the next middleware
    });

  // Create post in db
  // res.status(201).json({
  //   message: "Post created successfully!",
  //   post: {
  //     _id: new Date().toISOString(),
  //     title: title,
  //     content: content,
  //     creator: { name: "John Doe" },
  //     createdAt: new Date(),
  //   },
  // });
};
