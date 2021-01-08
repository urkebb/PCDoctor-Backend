const HttpError = require('../models/http-error');

const DUMMY_POSTS = [
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

exports.getPostById= getPostById;
exports.getPostByUserId=getPostByUserId;