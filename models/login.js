module.exports = {
    getHash: getHash
}

const db = require('../bin/database');

function getHash(email) {
    return db.query('SELECT password FROM users WHERE email = ?', [email])
        .then(results => {
            return results[0];
        })
        .catch(err => {
            console.error(err);
            return null;
        });
}