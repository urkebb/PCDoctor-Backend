const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const DUMMY_USERS= [
    {
        id: 'u1',
        name: 'Aleska Milosevic',
        email:'test@test.com',
        password: 'testers'
    }
];

const getUsers = (req,res,next) =>{
    res.json({users: DUMMY_USERS});
};
    
const signup = (req,res,next) =>{
    const{name, email, password, } = req.body;

    const hasUser = DUMMY_USERS.find(u=>u.email === email);
    if(hasUser)
    {
        throw new HttpError('Vec postoji korisnik sa ovim mailom',422); 
    }
    const createdUser=
    {
        id:uuid(),
        name:name,
        email: email,
        password: password
    };


    DUMMY_USERS.push(createdUser);

    res.status(201).json({user: createdUser});
};

const login = (req,res,next) =>
{
    const{email, password} =req.body;

    const identifiedUser = DUMMY_USERS.find(u=>u.email===email);

    if(!identifiedUser || identifiedUser.password !== password)
    {
        throw new HttpError('Nije pronadjen korisnik',401);
    }
    res.json({message:'logged in'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;