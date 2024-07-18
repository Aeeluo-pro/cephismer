module.exports = {
    getReservation: getReservation,
    updateReservation: updateReservation,
    deleteReservation: deleteReservation
}

const db = require('../bin/database');

function getReservation(id) {
    return db.query('SELECT * FROM reservations WHERE id = ?', [id])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function updateReservation(id, email, unite, operation, date_depot, nombre_bouteilles, commentaires) {
    return db.query('UPDATE reservations SET email = ?, unite = ?, operation = ?, date_depot = ?, nombre_bouteilles = ?, commentaires = ? WHERE id = ?', [email, unite, operation, date_depot, nombre_bouteilles, commentaires, id])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function deleteReservation(id){
    return db.query('DELETE FROM reservations WHERE id = ?', [id])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

// Path: bin/database.js