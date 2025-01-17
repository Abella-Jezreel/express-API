const { validationResult } = require("express-validator");

const Post = require("../models/post");

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

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect",
      errors: errors.array(),
    }); 
  } 
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/duck.jpg", // This is a dummy URL
    creator: { name: "John Doe" },
  });

  post.save().then((result) => {
    console.log(result);
    res.status(201).json({
      message: "Post created successfully!",
      post: result,
    });
  }
  ).catch((err) => {
    console.log
    (err);
  }
  );
 
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
