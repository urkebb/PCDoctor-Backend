const express = require('express');

const router = express.Router();

const DUMMY_POSTS = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    creator: 'u1'
  }
];

router.get('/:pid', (req, res, next) => {
  const postId = req.params.pid; // { pid: 'p1' }
  const post = DUMMY_POSTS.find(p => {
    return p.id === postId;
  });

  if (!post) {
    const error = new Error('Ne mogu da pronadjem post za navedeni ID');
    error.code = 404;
    throw error;
  }

  res.json({ post }); // => { place } => { place: place }
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;

  const post = DUMMY_POSTS.find(p => {
    return p.creator === userId;
  });

  if (!post) {
    const error = new Error('Ne mogu da pronadjem post za navedeni korisnikov ID');
    error.code = 404;
    return next(error);
  }

  res.json({ post });
});

module.exports = router;