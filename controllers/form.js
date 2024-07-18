module.exports = {
    booking: booking,
    verifyInputBottles: verifyInputBottles,
    downloadAnalysis: downloadAnalysis
}

const db = require('../models/default');
const fs = require('fs');
const path = require("path");

/**
 * Booking function, checks that the provided inputs are valid and adds the reservation to the database.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function booking(req, res) {
    const {email, unite, operation, date_depot, nombre_bouteilles, commentaires} = req.body;

    const reservation = {email, unite, operation, date_depot, nombre_bouteilles, commentaires};

    res.cookie('reservation', JSON.stringify(reservation), {maxAge: 900000, httpOnly: true});

    try {
        const check = await checkAll(reservation);
        if (check) {
            await db.form.addReservation(reservation);
            res.status(200).redirect('/success');
        } else {
            res.status(400).redirect('/');
        }
    } catch (err) {
        console.log("Error: 500 - Internal Server Error booking");
    }
}

/**
 * Verifies the number of bottles based on the date.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function verifyInputBottles(req, res) {
    let nb_Bottles = Number(req.body.value);
    var date = req.body.date;

    var freeBottles = await getFreeBottles(date);

    var isValid = nb_Bottles <= freeBottles;

    res.json({isValid: isValid, freeBottles: freeBottles});
}

/**
 * Verifies that the email is a valid intradef email.
 * @param email
 * @returns {boolean}
 */
function isEmailValid(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@intradef\.gouv\.fr$/;
    return regex.test(email);
}

/**
 * Downloads the analysis file.
 * @param req
 * @param res
 */
function downloadAnalysis(req, res) {
    var filePath = path.join(__dirname, '../public/uploads/', 'analyse_lasem.pdf');
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({error: 'Le fichier demandé est introuvable.'});
    }
}


/**
 * UTILS
 */

/**
 * Checks all the inputs of the reservation.
 * @param reservation
 * @returns {Promise<*|boolean>}
 */
async function checkAll(reservation) {
    const checkEmail = isEmailValid(reservation.email);
    const checkDate = isDateValid(reservation.date_depot);
    const checkBottles = checkDate ? await isNbBottlesValid(reservation.nombre_bouteilles, reservation.date_depot) : false;
    const checkOperation = reservation.operation != null;
    const checkUnit = reservation.unite != null;

    return checkEmail && checkDate && checkOperation && checkUnit && checkBottles;
}

/**
 * Checks if the date is valid.
 * @param date
 * @returns {boolean}
 */
function isDateValid(date) {
    if (!date) return false;

    let parts = date.split('-');

    let day = parts[2];
    let month = parts[1];
    let year = parts[0];

    var selectedDate = new Date(year, month - 1, day);
    var currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    var dayOfWeek = selectedDate.getDay();

    return !(selectedDate < currentDate && (dayOfWeek == 0 || dayOfWeek == 6)) && !(selectedDate < currentDate) && !(dayOfWeek == 0 || dayOfWeek == 6);
}

/**
 * Gets the number of free bottles with a request to the database based on the date.
 * @param date
 * @returns {Promise<number>}
 */
async function getFreeBottles(date) {
    let total_bottles = await db.form.getNumberOfBottles(date);
    total_bottles = total_bottles ? Number(total_bottles) : 0;
    return 50 - total_bottles;
}

/**
 * Checks if the number of bottles is valid.
 * @param bottles
 * @param date
 * @returns {Promise<boolean>}
 */
async function isNbBottlesValid(bottles, date) {
    let freeBottles = await getFreeBottles(date);
    return bottles <= freeBottles;
}