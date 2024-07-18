module.exports = {
    login: login
}

const db = require('../models/default');
const bcrypt = require('bcrypt');

function login(req, res){
    let id = req.body.username;
    let password = req.body.password;

    db.login.getHash(id).then((hash) => {
        if(hash){
            bcrypt.compare(password, hash.password, (err, result) => {
                if(err) {
                    console.error(err);
                    return res.status(500).json({ error: 'An error occurred while comparing passwords' });
                }
                if(result){
                    req.session.isAdmin = true;

                    return res.status(200).redirect('/admin');
                }
                else return res.render('login', {isError: true})
            });
        }
        else return res.render('login', {isError: true});
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while retrieving the password hash' });
    });
}