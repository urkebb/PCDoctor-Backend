const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const app = require('../app');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Aleska Milosevic',
        email: 'test@test.com',
        image: 'mikri.jpg',
        password: 'testers'
    }
];

const getUsers = (req, res, next) => {
    const query = 'SELECT * FROM "User" ';
    app.client.execute(query, [], (err, result) => {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json({ users: result.rows });
        }
    });
};

const signup = (req, res, next) => {
    /*const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        throw new HttpError('los input',422);
    }*/
    const { name, image, email, password, } = req.body;

    let existingUser;
    const query = 'SELECT * FROM "User" WHERE "email"=? ALLOW FILTERING';
    app.client.execute(query, [email], (err, result) => {
        if (err) {
        } else {
            existingUser = result.first();
        }
    });
    if (existingUser) {
        const error = new HttpError('User already exists', 422);
        return next(eror);

    }
    const createdUser =
    {
        id: uuid(),
        name: name,
        image: 'Hardkodiranlinkneki',
        email: email,
        password: password
    };
    var insertUser = 'INSERT INTO "User" (email,image,name,password,userid)';

    app.client.execute(insertUser, ['jedan.j@gmail.com', '12', '12', 'safasfasfasfa', '13131'], (err, result) => {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.status(201).json({
                user: createdUser,

            });

        }
    });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    let identifiedUser;
    const query = 'SELECT * FROM "User" WHERE "email"=? ALLOW FILTERING';
    app.client.execute(query, [email], (err, result) => {
        if (err) {
        } else {
            identifiedUser = result.rows[0];
        }
    });

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Nije pronadjen korisnik', 401);
    }
    res.json({ message: 'logged in' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;