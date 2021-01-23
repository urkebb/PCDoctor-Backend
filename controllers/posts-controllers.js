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

const getPostById = (req, res, next) => {
    const postId = req.params.pid; // { pid: 'p1' }
    const query = 'SELECT * FROM post_by_id WHERE postid=' + "'" + postId + "'";
    app.client.execute(query, function (err, result) {
        if (err) {
            res.status(404).send({ message: err });
        } else {
            res.json({ post: result.rows });
        }
    });
    //if (!post) {

    //  throw new HttpError('Ne mogu pronaci post za prosledjeni ID', 404);
    //}
};


const getPostsByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const query = 'SELECT * FROM post_by_id WHERE creatorid=' + "'" + userId + "'" + 'ALLOW FILTERING';
    app.client.execute(query, (err, result) => {
        if (err) {
            res.status(404).send({ message: err });
        } else {
            console.log(result.rows);
            res.json({ post: result.rows });
        }
    });
};



const createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        const error = new HttpError('Los input', 422);
        return next(error);
    };

    const { title, description, creator } = req.body;
    let idp = uuid() + '';

    const createdPost = {
        id: idp,
        title,
        description,
        creator: creator,
        likes: 0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg'
    };
    //                                                                                       (' + "'" + email + "'," + "'" + password + "','" + idp + "'" + ')';
    var insertPost = 'INSERT INTO post_by_id (creatorid,description,image,likes,postid,title) VALUES (' + "'" + creator + "'," + "'" + description + " ',' " + createdPost.image + "'," + 0 + ",'" + idp + "','" + title + "')";

    app.client.execute(insertPost, function (err, result) {
        if (err) {
            console.log('desava se neko cudo');
            res.status(404).send({ message: 'greska' })
        }
        else {
            var insertPost2 = 'INSERT INTO post_by_userid (userid,description,image,likes,postid,title) VALUES (' + "'" + creator + "'," + "'" + description + "',' " + createdPost.image + "'," + 0 + ",'" + idp + "','" + title + "')";

            app.client.execute(insertPost2, function (err, result) {
                if (err) {
                    res.status(404).send({ message: err });
                } else {
                    res.status(201).json({
                        post: createdPost,
                        message: 'post je napravljen'
                    });
                }
            });
        }
    });
};

const updatePost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        throw new HttpError('los input', 422);
    }

    const { title, description, creator } = req.body;
    const postId = req.params.pid;
    const query = 'SELECT * FROM post_by_id WHERE postid=' + "'" + postId + "'";
    app.client.execute(query, function (err, result) {
        if (err) {
            res.status(404).send({ message: err });
        }
        else {
            //if(result.rows[0]["postid"] === undefined)
            if (result.rows[0] === undefined) {
                res.json({ message: "Nije pronadjen post" });
            }
            else {
                let userid = result.rows[0]["creatorid"]
                /*
                const query2 = 'UPDATE post_by_userid SET title='+"'" + title +"'" +',description =' +"'"+ description +"'"+ 'WHERE userid=' +"'" + userid + "' "+'IF EXISTS';
                app.client.execute(query,function (err, result){
                    if (err) {
                        res.status(404).send({ message: err });
                    }
                });
        */
                const query2 = 'UPDATE post_by_id SET title=' + "'" + title + "'" + ',description =' + "'" + description + "'" + 'WHERE postid=' + "'" + postId + "' " + 'IF EXISTS';
                app.client.execute(query2, function (err, result) {
                    if (err) {
                        res.status(404).send({ message: err });
                    }
                    else {
                        res.json({ 
                            id: userid,
                            message: "Updateovan je post" });
                    }
                });
            }
        }
    });
};

const deletePost = (req, res, next) => {
    const postId = req.params.pid;
    const query = 'SELECT * FROM post_by_id WHERE postid=' + "'" + postId + "'";
    app.client.execute(query, function (err, result) {
        if (err) {
            res.status(404).send({ message: err });
        }
        else {
            if (result.rows[0]["postid"] === undefined) {
                res.json({ message: "Nije pronadjen post" });
            }
            else {
                let userid = result.rows[0]["creatorid"]

                /*
                const query2 = 'DELETE FROM post_by_userid WHERE userid=' + "'" + userid + "'";
                app.client.execute(query, function (err, result) {
                    if (err) {
                        res.status(404).send({ message: err });
                    }
                });
                */
                const query2 = 'DELETE FROM post_by_id WHERE postid=' + "'" + postId + "'";
                app.client.execute(query2, function (err, result) {
                    if (err) {
                        res.status(404).send({ message: err });
                    }
                    else {
                        res.json({ message: "Obrisan je post" });
                    }
                });
            }
        }
    });

};

exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
