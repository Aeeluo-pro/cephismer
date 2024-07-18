module.exports = {
    login: login
}

const db = require('../models/default');
const bcrypt = require('bcrypt');

function login(req, res){
    let email = req.body.email;
    let password = req.body.password;

    db.login.getHash(email).then((hash) => {
        if(hash){
            bcrypt.compare(password, hash.password, (err, result) => {
                if(err) console.log(err);
                if(result){
                    req.session.isAdmin = true;
                    res.status(200).redirect('/admin');
                }
                else res.render('login', {isError: true})
            });
        }
        else res.render('login', {isError: true});
    }).catch((err) => {
        console.log("Error: 500 - Internal Server Error");
    });
}