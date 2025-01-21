const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post");
const User = require("../models/user");

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

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1; // Get the current page from the query params
  const perPage = 5; //Items per page
  const skip = (currentPage - 1) * perPage; // Skip the first items
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find().skip(skip).limit(perPage);
    res.status(200).json({
      message: "Fetched posts successfully.",
      posts: posts,
      totalItems: totalItems,
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
    const error = new Error("Invalid post ID.");
    error.statusCode = 422;
    return next(error);
  }

  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
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

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.imageUrl;

  if (req.file) {
    imageUrl = req.file.path.replace(/\\/g, "/");
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      // Check logged in user
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Clear image
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      User.findById(req.userId)
        .then((user) => {
          user.posts.pull(postId);
          return user.save();
        })
        .then((result) => {
          res.status(200).json({ message: "Deleted post." });
          console.log(result);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace(/\\/g, "/");
  const title = req.body.title;
  const content = req.body.content;
  console.log(req.user.name);
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
    creatorName: req.user.name,
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: post,
        creator: { _id: creator._id, name: creator.name },
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
