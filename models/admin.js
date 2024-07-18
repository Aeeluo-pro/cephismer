module.exports = {
    getReservations: getReservations,
    searchReservations: searchReservations,
    exportData: exportData,
    getSuspensionDates: getSuspensionDates,
    setSuspensionDates: setSuspensionDates,
    getIsManuallyUnavailable: getIsManuallyUnavailable,
    getUnavailableMessage: getUnavailableMessage,
    setManualSuspensionStatus: setManualSuspensionStatus,
    addUnavailableMessage: addUnavailableMessage,
    getDaysWithMaxBottlesBooked: getDaysWithMaxBottlesBooked
}

var db = require('../bin/database');

function getReservations() {
    return db.query('SELECT * FROM reservations')
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function searchReservations(email, unite, operation, date_depot, nombre_bouteilles, commentaires) {
    let sql = "SELECT * FROM reservations WHERE 1=1";
    let params = [];

    if (email) {
        sql += " AND email LIKE ?";
        params.push('%' + email + '%');
    }

    if (unite) {
        sql += " AND unite LIKE ?";
        params.push('%' + unite + '%');
    }

    if (operation) {
        sql += " AND operation = ?";
        params.push(operation);
    }

    if (date_depot) {
        sql += " AND date_depot = ?";
        params.push(date_depot);
    }

    if (nombre_bouteilles) {
        sql += " AND nombre_bouteilles = ?";
        params.push(nombre_bouteilles);
    }

    if (commentaires) {
        sql += " AND commentaires LIKE ?";
        params.push('%' + commentaires + '%');
    }

    return db.query(sql, params)
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function exportData(start, end) {
    return db.query('SELECT * FROM reservations WHERE date_depot >= ? AND date_depot <= ?', [start, end])
        .then(results => {
            const dataToExport = results;
            return db.query('DELETE FROM reservations WHERE date_depot >= ? AND date_depot <= ?', [start, end])
                .then(() => {
                    return dataToExport;
                });
        })
        .catch(err => {
            throw err;
        });
}

function getSuspensionDates() {
    return db.query('SELECT suspension_dates FROM admin')
        .then(results => {
            console.log(results);
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function setSuspensionDates(suspension_dates) {
    return db.query('UPDATE admin SET suspension_dates = ?', [suspension_dates])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function getIsManuallyUnavailable() {
    return db.query('SELECT manual_suspension_status FROM admin')
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function getUnavailableMessage() {
    return db.query('SELECT message FROM admin')
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function setManualSuspensionStatus(status) {
    return db.query('UPDATE admin SET manual_suspension_status = ?', [status])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function addUnavailableMessage(message) {
    return db.query('UPDATE admin SET message = ?', [message])
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}

function getDaysWithMaxBottlesBooked() {
    const query = 'SELECT date_depot FROM reservations GROUP BY date_depot HAVING SUM(nombre_bouteilles) >= 50';

    return db.query(query)
        .then(results => {
            return results;
        })
        .catch(err => {
            throw err;
        });
}