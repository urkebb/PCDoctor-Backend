const express = require('express');

const {check } = require('express-validator');

const postsControllers=require('../controllers/posts-controllers');
const fileUpload = require('../MIddleware/file-upload');
 
const router = express.Router();



router.get('/:pid', postsControllers.getPostById);

router.get('/user/:uid',postsControllers.getPostsByUserId );

router.post('/',fileUpload.single('image'),
[check('title').not().isEmpty(),
check('description').isLength({min: 5})], 
postsControllers.createPost);

router.patch('/:pid',
[
    check('title').not().isEmpty(),check('description').isLength({min: 5})
] ,postsControllers.updatePost);
router.delete('/:pid',postsControllers.deletePost);

module.exports = router;