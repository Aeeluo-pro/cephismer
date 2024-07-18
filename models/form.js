module.exports = {
    addReservation: addReservation,
    getNumberOfBottles: getNumberOfBottles
}

const db = require('../bin/database');

function addReservation(reservation) {
    return db.query('INSERT INTO reservations (email, unite, operation, date_depot, nombre_bouteilles, commentaires) VALUES (?, ?, ?, ?, ?, ?)',
        [reservation.email, reservation.unite, reservation.operation, reservation.date_depot,
            reservation.nombre_bouteilles, reservation.commentaires])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function getNumberOfBottles(date) {
    var query = 'SELECT SUM(nombre_bouteilles) AS total_bottles FROM reservations WHERE date_depot = ?';

    return db.query(query, [date])
        .then(results => {
            return results[0]['total_bottles'];
        })
        .catch(err => {
            throw err;
        });
}