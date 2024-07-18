module.exports = {
    getReservations: getReservations,
    searchReservations: searchReservations,
    uploadFile: uploadFile,
    exportData: exportData,
    setSuspendDates: setSuspendDates,
    manuallySuspend: manuallySuspend,
    removeSuspend: removeSuspend
}

const db = require("../models/default");
const fs = require('fs');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, 'analyse_lasem.pdf'); // specific file name and extension
    }
});

const upload = multer({storage: storage});

function uploadFile(req, res) {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Une erreur s\'est produite lors du traitement de votre requête.'});
        } else {
            res.status(200).redirect('/');
        }
    });
}


function getReservations(req, res, next) {
    if (req.session.isAdmin) {
        db.getReservations()
            .then(results => {
                res.render('admin', {reservations: results});
            })
            .catch(err => {
                next(err);
            });
    } else res.status('4O1').redirect('/');
}

function searchReservations(req, res, next) {
    if (req.session.isAdmin) {
        let email = req.body.email;
        let unite = req.body.unite;
        let operation = req.body.operation;
        let date_depot = req.body.date_depot;
        let nombre_bouteilles = req.body.nombre_bouteilles;
        let commentaires = req.body.commentaires;

        db.admin.searchReservations(email, unite, operation, date_depot, nombre_bouteilles, commentaires).then(reservations => {
            reservations.forEach(reservation => {
                let date = new Date(reservation.date_depot);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
                let year = date.getFullYear();

                reservation.date_depot = `${day}-${month}-${year}`;
            });

            res.render('admin', {reservations: reservations});

        }).catch(err => {
            next(err);
        });
    } else res.status('4O1').redirect('/');
}

const Json2csvParser = require("json2csv").Parser;

function exportData(req, res, next) {
    db.admin.exportData(req.body.start_date, req.body.end_date).then((results) => {
        const jsonData = JSON.parse(JSON.stringify(results));
        const json2csvParser = new Json2csvParser({header: true});
        const csv = json2csvParser.parse(jsonData);

        res.header('Content-Disposition', 'attachment; filename="export.csv"');
        res.header('Content-Type', 'text/csv');
        res.status(200).send(csv);
    }).catch(err => {
        next(err);
    });
}

function setSuspendDates(req, res, next) {
    var dates = req.body.suspension_dates;

    db.admin.setSuspensionDates(dates).then(() => {
        res.status(200).redirect('/admin');
    }).catch(err => {
        next(err);
    });
}

function manuallySuspend(req, res, next) {
    let message = req.body.manual_suspension_message;
    db.admin.setManualSuspensionStatus(true).then(() => {
    }).catch(err => {
        next(err);
    });
    db.admin.addUnavailableMessage(message).then(() => {
        res.status(200).redirect('/admin');
    }).catch(err => {
        next(err);
    });
}

function removeSuspend(req, res) {
    if (req.session.isAdmin) {
        if (req.session.isManuallyUnavailable) {
            db.admin.setManualSuspensionStatus(false).then(() => {
                res.status(200).redirect('/admin');
            }).catch((err) => {
                console.log(err);
            });
        } else if (req.session.isDateUnavailable) {
            var currentDate = new Date();
            var day = String(currentDate.getDate()).padStart(2, '0');
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var year = currentDate.getFullYear();
            var date = `${year}-${month}-${day}`;
            console.log("Current date : " + date);
            console.log("Suspension dates: " + req.session.suspension_dates);
            var dates = req.session.suspension_dates;
            dates = dates.filter(d => d !== date);

            console.log("Dates filtered : " + dates);

            var newDates = dates.join(';');

            console.log("New Dates : " + newDates);

            db.admin.setSuspensionDates(newDates).then(() => {
                res.status(200).redirect('/admin');
            }).catch((err) => {
                console.log(err);
            });
        } else{
            res.status(500).redirect('/admin');
        }
    }
}
