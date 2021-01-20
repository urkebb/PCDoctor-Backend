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
    const query = 'SELECT * FROM user_by_id ';
    app.client.execute(query, [], (err, result) => {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.json({ users: result.rows });
        }
    });
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new HttpError('Los input', 422);
        return next(error);
    };

    const { name, image, email, password } = req.body;

    const query = 'SELECT email FROM credidentials WHERE email=' + "'" + email + "'";
    app.client.execute(query, function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            if (result.rows[0] === undefined) {


                let idp = uuid();

                const createdUser =
                {
                    id: idp,
                    name: name,
                    image: 'Hardkodiranlinkneki',
                    email: email,
                    password: password
                };

                var insertUser2 = 'INSERT INTO credidentials (email,password) VALUES (' + "'" + email + "'," + "'" + password + "'" + ')';
                app.client.execute(insertUser2, function (err, result) {
                    if (err) {
                        res.status(404).send({ msg: err });
                    }
                });

                var insertUser = 'INSERT INTO user_by_id (email,image,name,userid) VALUES (' + "'" + email + "'," + "'" + 'haradkodiranurl' + "','" + name + "','" + idp + "'" + ')';
                app.client.execute(insertUser, function (err, result) {
                    if (err) {
                        res.status(404).send({ msg: err });
                    }
                    else {
                        res.status(201).json({

                            user: createdUser
                        });
                    }
                });


            } else {
                res.status(401);
                res.send({ message: 'Pronadjen je korisnik sa ovim e-mailom' });

            }





        }
    });


};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const query = 'SELECT email,password FROM credidentials WHERE email=' + "'" + email + "'";
    app.client.execute(query, function (err, result) {
        
        if (err) {
            res.status(404).send({ msg: err });
        }
        else {
            if (result.rows[0] === undefined) {
                console.log(result.rows[0]);
                res.status(401);
                res.send({ message: 'Nije pronadjen korisnik' });

            }
            else {

                if ((result.rows[0]["email"] === email) && (result.rows[0]["password"] === password)) {
                    res.status(200);
                    res.json({
                        message: 'uspesno si se logovao'
                    });
                }
                else {
                    //const error=new HttpError('NE MOZE',401);
                    //return next(error);

                    res.status(401);
                    res.json({ message: 'neuspelo logovanje' });

                }
            }
        }
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;