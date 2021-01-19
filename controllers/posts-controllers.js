const HttpError = require('../models/http-error');
const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');
const { Client } = require('cassandra-driver');

const app = require('../app');

let DUMMY_POSTS = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        creator: 'u1',
        likes: 0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg'
    }
];

const getPostById =  (req, res, next) => {
    const postId = req.params.pid; // { pid: 'p1' }
    const query = 'SELECT * FROM post_by_id WHERE postid=' + "'" + postId + "'";
    app.client.execute(query,function (err, result){
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json({ post: result.rows });
        }
    });
    //const post = DUMMY_POSTS.find(p => {
    //  return p.id === postId;
    //});

    //if (!post) {

    //  throw new HttpError('Ne mogu pronaci post za prosledjeni ID', 404);
    //}

    // res.json({ post }); // => { place } => { place: place }
};


const getPostsByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const query = 'SELECT * FROM "Post" WHERE "creator"=? ALLOW FILTERING';
    app.client.execute(query, [userId], (err, result) => {
        if (err) {
          res.status(404).send({ msg: err });
        } else {
           res.json({ post: result.rows });
        }
    });
};



const createPost = (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        throw new HttpError('Los input',422);
    };

    const { title, description,creator } = req.body;
    let idp = uuid();
    
    const createdPost = {
        id: idp,
        title,
        description,
        creator: 'u3',
        likes: 0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg'
    };


    var insertPost = 'INSERT INTO "Post" (creator,description,image,"like","postID",title)';

    client.execute(insertPost, ['u4', 'boka svilen', 'kurac', 'palek', 'brmbrm'],(err, result) => {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.status(201).json({ post: createdPost });
        }
        });
      const errors = validationResult(req);



   /* const { title, description, creator } = req.body;

    const createdPost = {
        id: uuid(),
        title: 'mikri',
        description: 'maus',
        creator: 'u3'
    };



    res.status(201).json({ post: createdPost });*/
    //DUMMY_POSTS.push(createdPost);



};

const updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('los input', 422);
    }

    const { title, description } = req.body;
    const postId = req.params.pid;

    const updatedPost = { ...DUMMY_POSTS.find(p => p.id === postId) };
    const postIndex = DUMMY_POSTS.findIndex(p => p.id === postId);
    updatePost.title = title;
    updatedPost.description = description;
    DUMMY_POSTS[postIndex] = updatedPost;
    res.status(200).json({ post: updatedPost });
};
const deletePost = (req, res, next) => {
    const postId = req.params.pid;
    const query = 'DELETE FROM "Post" WHERE "postID"=? ALLOW FILTERING';
    app.client.execute(query, [postId], (err, result) => {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json({ msg: "Obrisan je post" });
        }
    });
};

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
