const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');
const cassandra = require('cassandra-driver');

const postsRoutes = require('./routes/posts-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], localDataCenter: 'datacenter1', keyspace: 'pcdoctor' });
client.connect((err, res) => { console.log('Connected to Cassandra'); });

app.use(bodyParser.json());
app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    next();
});

app.use('/api/posts', postsRoutes); // => /api/posts...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Ne mogu naci ovu rutu', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(req.file)
    {
        fs.unlink(req.file.path,err=>{
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'Doslo je do nepoznate greske' });
});
exports.client = client;
app.listen(5000);