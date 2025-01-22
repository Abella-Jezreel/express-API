const express = require("express");
const { body, param } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/posts", isAuth, feedController.getPosts);
router.get(
  "/post/:postId",
  isAuth,
  param("postId").isMongoId(),
  feedController.getPost
);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);
 
router.put(
  "/post/:postId",
  isAuth,
  [
    param("postId").isMongoId(),
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
); 

router.delete(
  "/post/:postId",
  isAuth,
  param("postId").isMongoId(),
  feedController.deletePost
);

module.exports = router;
