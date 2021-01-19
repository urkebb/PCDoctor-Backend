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

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        console.log(errors);
        throw new HttpError('Los input',422);
    };

    const { name, image, email, password } = req.body;

    const query = 'SELECT email FROM credidentials WHERE email='+ "'" + email + "'";
    app.client.execute(query,function(err, result){
        if (err) {
            res.status(404).send({ msg: err });
        } else {
             var pronadjeniMail = result.rows[0]["email"];
             if(!(pronadjeniMail === undefined))
             {
                throw new HttpError('Pronadjen je vec korisnik sa ovim mailom,molimo logujte se', 402);
             }   
        }
    });

    let idp=uuid();

    const createdUser =
    {
        id:idp,
        name: name,
        image: 'Hardkodiranlinkneki',
        email: email,
        password: password
    };

    var insertUser = 'INSERT INTO user_by_id (email,image,name,password,userid) VALUES ('+"'"+email+"'," + "'"+'haradkodiranurl'
    +"','" + name +"','"+ password + "','" + idp +"'"+')';

    app.client.execute(insertUser,function (err, result) {
        if (err) {
            res.status(404).send({ msg: err });
        } else {
            res.status(201).json({
                user : createdUser
            });

        }
    });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const query = 'SELECT email FROM credidentials WHERE email='+ "'" + email + "'";
    app.client.execute(query,function(err, result){
        if (err) {
            res.status(404).send({ msg: err });
        } 
        else 
        {
             var pronadjeniMail = result.rows[0]["email"];
             var pronadjeniPass = result.rows[0]["password"];
             if(!(pronadjeniMail === undefined) && pronadjeniPass===password)
             {
                res.json({ message: 'logged in' });
             }
             else
             {
                throw new HttpError('Lose informacije', 401);
             }   
        }
    });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;