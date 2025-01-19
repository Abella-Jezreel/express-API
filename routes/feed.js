const express = require('express');
const { body, param  } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts); 
router.get('/post/:postId', param('postId').isMongoId(), feedController.getPost);
router.post('/post', [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.createPost);

router.put('/post/:postId', [
    param('postId').isMongoId(),
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
], feedController.updatePost);

router.delete('/post/:postId', param('postId').isMongoId(), feedController.deletePost);

module.exports = router;