const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');

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


const getPostByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const post = DUMMY_POSTS.find(p => {
        return p.creator === userId;
    });

    if (!post) {

        return next(
            new Error('Ne mogu da pronadjem post za navedeni korisnikov ID', 404)
        );
    }

    res.json({ post });
};

const createPost = (req, res, next) => {
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
    DUMMY_POSTS= DUMMY_POSTS.filter(p => p.id !== postId);
    res.stauts(200).json({message: 'Deleted place.'});
 };

exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
