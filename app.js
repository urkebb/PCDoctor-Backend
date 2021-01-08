const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const postsRoutes = require('./routes/posts-routes');

const app = express();

app.use(bodyParser.json());

app.use('/api/posts', postsRoutes); // => /api/posts...

app.use((req,res,next) => {
    const error = new HttpError('Ne mogu naci ovu rutu', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'Doslo je do nepoznate greske' });
});

app.listen(5000);