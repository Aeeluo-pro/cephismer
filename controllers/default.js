module.exports = {
    renderLogin: renderLogin,
    renderEdit: renderEdit,
    renderAdmin: renderAdmin,
    renderForm: renderForm,
    renderSuccess: renderSuccess,
    renderUnavailable: renderUnavailable,
    admin: require('./admin'),
    edit: require('./edit'),
    login: require('./login'),
    logout: require('./logout'),
    form: require('./form')
}

const db = require("../models/default");
const fs = require('fs');
const path = require("path");
const DEFAULT_MESSAGE = "Le site de réservation est momentanément suspendu pour cause d'avarie ou d'absence. Veuillez réeesayer momentanément.";

/**
 * Render the form page
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function renderForm(req, res) {
    var suspensionDatesDb = await db.admin.getSuspensionDates();
    var suspensionDates = suspensionDatesDb[0].suspension_dates.split(';');

    let unavailable = await isManuallyUnavailable();

    if (unavailable) {
        res.status(401).redirect('/unavailable');
        return;
    }

    var passedDates = await getPassedDates(suspensionDates);

    db.admin.setSuspensionDates(passedDates).catch((err) => {
        console.log("Error: 500 - Internal Server Error");
    });
    var daysWithMaxBottlesBooked = await getDaysWithMaxBottlesBooked();

    suspensionDates = suspensionDates.concat(daysWithMaxBottlesBooked);

    var fileExists = false;
    var pathFile = path.join(__dirname, '../public/uploads/analyse_lasem.pdf');
    if (fs.existsSync(pathFile)) fileExists = true;

    if (req.cookies.reservation) {
        let reservation = JSON.parse(req.cookies.reservation);
        var pathFile = path.join(__dirname, '../public/uploads/analyse_lasem.pdf');
        res.render('form', {
            reservation: reservation,
            isAdmin: req.session.isAdmin,
            fileExists: fileExists,
            suspensionDates: suspensionDates
        });
        return;
    } else res.render('form', {
        reservation: {},
        isAdmin: req.session.isAdmin,
        fileExists: fileExists,
        suspensionDates: suspensionDates
    });
}


/**
 * Render the admin page
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function renderAdmin(req, res) {
    if (req.session.isAdmin) {

        var suspensionDates = await db.admin.getSuspensionDates();
        suspensionDates = suspensionDates[0].suspension_dates.split(';');

        var passedDates = await getPassedDates(suspensionDates);
        db.admin.setSuspensionDates(passedDates).catch((err) => {
            console.log("Error: 500 - Internal Server Error");
        });

        var message = await getUnavailableMessage();
        var manuallyUnavailable = await isManuallyUnavailable();

        req.session.isManuallyUnavailable = manuallyUnavailable;
        req.session.suspension_dates = suspensionDates;

        db.admin.getReservations().then((reservations) => {
            reservations.forEach(reservation => {
                let date = new Date(reservation.date_depot);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0');
                let year = date.getFullYear();

                reservation.date_depot = `${day}-${month}-${year}`;
            });

            res.render('admin', {
                reservations: reservations,
                isManuallyUnavailable: manuallyUnavailable,
                message: message,
                suspensionDates: suspensionDates
            });
        }).catch((err) => {
            console.log("Error: 500 - Internal Server Error");
        });
    } else res.status('4O1').redirect('/');
}

/**
 * Render the edit page
 * @param req
 * @param res
 * @param id
 */
function renderEdit(req, res, id) {
    if (req.session.isAdmin) {

        db.edit.getReservation(id).then((reservation) => {

            let date = new Date(reservation[0].date_depot);
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            reservation[0].date_depot = `${year}-${month}-${day}`;

            res.render('edit', {reservation: reservation[0]});
        }).catch((err) => {
            console.log("Error: 500 - Internal Server Error");
        });
    } else res.status('4O1').redirect('/');
}

/**
 * Render the login page
 * @param req
 * @param res
 */
function renderLogin(req, res) {
    res.status(200).render('login');
}

/**
 * Render the success page
 * @param req
 * @param res
 */
function renderSuccess(req, res) {
    res.status(200).render('success');
}

/**
 * Render the unavailable page if the website is currently suspended
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function renderUnavailable(req, res) {
    var suspensionDates = await db.admin.getSuspensionDates();
    suspensionDates = suspensionDates[0].suspension_dates.split(';');

    var manuallyUnavailable = await isManuallyUnavailable();
    var unavailable = await isCurrentlyUnavailable(suspensionDates);

    if (manuallyUnavailable) {
        getUnavailableMessage().then((message) => {
            if(message == "") message = DEFAULT_MESSAGE;
            res.render('unavailable', {message: message});
        }).catch((err) => {
            console.log("Error: 500 - Internal Server Error");
        });
    } else res.status(401).redirect('/');
}

/**
 * Checks if the website is currently suspended
 * @returns {*|Promise<any>}
 */
function isCurrentlyUnavailable(suspensionDates) {
    let date = new Date();
    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 based, so we add 1
    let day = ("0" + date.getDate()).slice(-2); // Pad with leading 0 if needed
    let formattedDate = `${year}-${month}-${day}`;

    if (suspensionDates.includes(formattedDate)) {
        return true;
    } else return false;
}

/**
 * Checks if the website is manually suspended
 * @returns {*|Promise<any>}
 */
function isManuallyUnavailable() {
    return db.admin.getIsManuallyUnavailable().then((results) => {
        return !!results[0].manual_suspension_status;
    }).catch((err) => {
        console.log("Error: 500 - Internal Server Error");
    });
}

function getUnavailableMessage() {
    return db.admin.getUnavailableMessage().then((results) => {
        if (results.length == 0) return "";
        return results[0].message;
    }).catch((err) => {
        console.log("Error: 500 - Internal Server Error");
    });
}

/**
 * Get the dates that have already passed
 * @returns {*|Promise<any>}
 */
function getPassedDates(suspensionDates) {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 based, so we add 1
    var day = ("0" + date.getDate()).slice(-2); // Pad with leading 0 if needed
    var formattedDate = `${year}-${month}-${day}`;

    // Split the suspension_dates string into an array
    var dates = suspensionDates;
    // Filter out the dates that are earlier than today
    dates = dates.filter((date) => date >= formattedDate);
    // Join the dates back into a string
    return dates.join(';');
}

/**
 * Get the days with the maximum number of bottles booked and format the results to be displayed as [YYYY-MM-DD]
 * @returns {*|Promise<any>}
 */
function getDaysWithMaxBottlesBooked() {
    return db.admin.getDaysWithMaxBottlesBooked().then((results) => {
        const formattedResults = results.map(row => {
            let date = row.date_depot ? new Date(row.date_depot).toISOString().split('T')[0] : null;
            return date;
        });
        return formattedResults;
    }).catch((err) => {
        console.log("Error: 500 - Internal Server Error", err);
        throw err;
    });
}

function getTodaysDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are 0 based, so we add 1
    var day = ("0" + date.getDate()).slice(-2); // Pad with leading 0 if needed
    var formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}