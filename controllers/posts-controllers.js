const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');
const {validationResult } = require('express-validator');

let DUMMY_POSTS = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        creator: 'u1'
    }
];


const getPostById = (req, res, next) => {
    const postId = req.params.pid; // { pid: 'p1' }
    const post = DUMMY_POSTS.find(p => {
        return p.id === postId;
    });

    if (!post) {

        throw new HttpError('Ne mogu pronaci post za prosledjeni ID', 404);
    }

    res.json({ post }); // => { place } => { place: place }
};


const getPostsByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const posts = DUMMY_POSTS.filter(p => {
        return p.creator === userId;
    });

    if (!posts || posts.length === 0) {

        return next(
            new Error('Ne mogu da pronadjem postove za navedeni korisnikov ID', 404)
        );
    }

    res.json({ posts });
};

const createPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        throw new HttpError('los input',422);
    }

    const { title, description, creator } = req.body;

    const createdPost = {
        id: uuid(),
        title,
        description,
        creator
    };

    DUMMY_POSTS.push(createdPost);
    res.status(201).json({ post: createdPost });
};

const updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        throw new HttpError('los input',422);
    }

    const { title, description } = req.body;
    const postId = req.params.pid;

    const updatedPost = { ...DUMMY_POSTS.find(p => p.id === postId) };
    const postIndex = DUMMY_POSTS.findIndex(p => p.id === postId);
    updatePost.title = title;
    updatedPost.description = description;
    DUMMY_POSTS[postIndex] = updatedPost;
    res.status(200).json({post: updatedPost});
};
const deletePost = (req, res, next) => {
    const postId =req.params.pid;
    if(!DUMMY_POSTS.find(p=>p.id === postId))
    {
        throw new HttpError ('nisam mogo da nadjem post',404);
    }
    DUMMY_POSTS= DUMMY_POSTS.filter(p => p.id !== postId);
    res.stauts(200).json({message: 'Deleted place.'});
 };

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
