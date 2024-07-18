import "/static/flatpickr/dist/l10n/fr.js";

var suspension_dates = window.suspensionDates || [];

flatpickr("#date_depot", {
    mode: "single",
    dateFormat: "Y-m-d",
    conjunction: ';',
    locale: 'fr',
    disable: suspension_dates
});

const ERROR_CLASSES = {
    borderError: "border-error",
    errorContainer: "error-container",
    errorContainerEmail: "error-container-email",
    errorContainerNb: "error-container-nb",
    errorContainerBottles: "error-container-bottles",
    errorContainerOp: "error-container-op",
    errorContainerUnite: "error-container-unite",
    nbBottlesContainer: "nb_bottles_container"
};

const ERROR_MESSAGES = {
    dateEmpty: "Veuillez renseigner une date de dépôt.",
    dateInfWeekend: "La date de dépôt ne doit pas être inférieure à la date actuelle et pendant le weekend",
    dateInf: "La date de dépôt ne doit pas être inférieure à la date actuelle.",
    dateWeekend: "La date de dépôt ne doit pas être pendant le weekend",
    emailIntradef: "L'adresse email doit être une adresse intradef.",
    bottlesMaxReached: "Le nombre maximal de bouteilles réservées a été atteint pour ce jour. Veuillez choisir un autre jour.",
    bottlesSup: "Vous ne pouvez pas réserver plus de bouteilles.",
    bottlesEmpty: "Veuillez renseigner un nombre de bouteilles.",
    operationEmpty: "Veuillez renseigner une opération.",
    uniteEmpty: "Veuillez renseigner une unité."
};

function appendErrorMessage(elementId, containerClass, messageClass, message) {
    document.querySelector(elementId).insertAdjacentHTML('beforeend', `<div class="${containerClass}"><p class="error-message small" id="${messageClass}">${message}</p></div>`);
}

function addBorderError(elementId) {
    document.querySelector(elementId).classList.add(ERROR_CLASSES.borderError);
}

function removeErrorMessage(containerClass) {
    let errorElement = document.querySelector(`.${containerClass}`);
    if (errorElement) {
        errorElement.remove();
    }
}

function removeBorderError(elementId, className) {
    let element = document.querySelector(elementId);
    if (element.classList.contains(className)) {
        element.classList.remove(className);
    }
}
/**
 *
 * Checks if the email address is an intradef address and displays an error message if it is not.
 *
 */

function checkEmailAddress() {
    var email = document.querySelector('#email').value;
    const regex = /^[a-zA-Z0-9._%+-]+@intradef\.gouv\.fr$/;

    if (document.querySelector(`.${ERROR_CLASSES.errorContainerEmail}`)) {
        removeErrorMessage(ERROR_CLASSES.errorContainerEmail);
        removeBorderError('#email', ERROR_CLASSES.borderError);
    }

    if (!regex.test(email)) {
        appendErrorMessage('#div_email', ERROR_CLASSES.errorContainerEmail, 'error-email', ERROR_MESSAGES.emailIntradef);
        addBorderError('#email');
        return false;
    }
    return true;
}

/**
 * Checks if the operation field is empty and displays an error message if it is.
 */

function checkOperation() {
    if (document.querySelector(`.${ERROR_CLASSES.errorContainerOp}`)) {
        removeErrorMessage(ERROR_CLASSES.errorContainerOp);
        removeBorderError('#operation', ERROR_CLASSES.borderError);
    }

    if (!document.querySelector('#operation').value) {
        appendErrorMessage('#div_operation', ERROR_CLASSES.errorContainerOp, 'error-operation', ERROR_MESSAGES.operationEmpty);
        addBorderError('#operation');
        return false;
    }
    return true;
}

/**
 * Checks if the nombre_bouteilles field is empty and displays an error message if it is.
 */

function checkEmptyBottlesInput() {
    var value = document.querySelector('#nombre_bouteilles').value;
    if (!value) {
        removeErrorMessage(ERROR_CLASSES.nbBottlesContainer);
        removeErrorMessage(ERROR_CLASSES.errorContainerBottles);
        appendErrorMessage('#div_nombre_bouteilles', ERROR_CLASSES.errorContainerBottles, 'error-sup-bottles', ERROR_MESSAGES.bottlesEmpty);
        addBorderError('#nombre_bouteilles');
        return false;
    }
    return true;
}

/**
 * Checks if the unite field is empty and displays an error message if it is.
 */

function checkUnite() {
    const unitValue = document.querySelector('#unite').value;
    const errorContainerExists = document.querySelector('.error-container-unite');

    if (unitValue === "") {
        if (!errorContainerExists) {
            appendErrorMessage('#div_unite', ERROR_CLASSES.errorContainerUnite, 'error-unite', ERROR_MESSAGES.uniteEmpty);
            addBorderError('#unite');
            return false;
        }
    } else if (errorContainerExists) {
        removeErrorMessage(ERROR_CLASSES.errorContainerUnite);
        removeBorderError('#unite', ERROR_CLASSES.borderError);
        return true;
    }
    return true;
}

/**
 * @param date
 * Checks if the date is valid and displays an error message if it is not.
 *
 */

function checkDate(date) {
    if (!date) return {isValid: false, error: 'error-empty'};

    let parts = date.split('-');

    let day = parts[2];
    let month = parts[1];
    let year = parts[0];

    var selectedDate = new Date(year, month - 1, day);
    var currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    var dayOfWeek = selectedDate.getDay();

    switch (true) {
        case (selectedDate < currentDate && (dayOfWeek == 0 || dayOfWeek == 6)):
            return {isValid: false, error: 'error-inf-weekend'};
        case (selectedDate < currentDate):
            return {isValid: false, error: 'error-inf'};
        case (dayOfWeek == 0 || dayOfWeek == 6):
            return {isValid: false, error: 'error-weekend'};
        default:
            return {isValid: true};
    }
}

/**
 * @param date
 * Check number of bottles based on the date.
 *
 */
function getFreeBottlesNumber() {
    var date = document.querySelector('#date_depot').value;
    var value = document.querySelector('#nombre_bouteilles').value;

    return new Promise((resolve, reject) => {
        fetch('/verifyInputBottles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                value: value,
                date: date
            }),
        })
            .then(response => response.json())
            .then(data => resolve(data))
            .catch((error) => {
                console.error('Error:', error);
            });
    })
}


async function checkBottles() {
    let value = document.querySelector('#nombre_bouteilles').value;
    var date = document.querySelector('#date_depot').value;

    if (!date || !checkDate(date)) {
        document.querySelector('#nombre_bouteilles').disabled = true;
        return false;
    } else {
        document.querySelector('#nombre_bouteilles').disabled = false;
    }

    var response = await getFreeBottlesNumber();

    if (document.querySelector(`.${ERROR_CLASSES.nbBottlesContainer}`)) {
        removeErrorMessage(ERROR_CLASSES.nbBottlesContainer);
    }
    if (document.querySelector(`.${ERROR_CLASSES.errorContainerBottles}`)) {
        removeErrorMessage(ERROR_CLASSES.errorContainerBottles);
        removeBorderError('#nombre_bouteilles', ERROR_CLASSES.borderError);
    }

    if (response.isValid) {
        if (value == response.freeBottles) {
            document.querySelector('#div_nombre_bouteilles').insertAdjacentHTML('beforeend', `<div class="nb_bottles_container"><p class="small" id="free_bottles">Vous ne pouvez pas réserver plus de bouteilles.</p></div>`);
            return true;
        } else {
            document.querySelector('#div_nombre_bouteilles').insertAdjacentHTML('beforeend', `<div class="nb_bottles_container"><p class="small" id="free_bottles">Vous pouvez réserver jusqu'à ${response.freeBottles} bouteilles.</p></div>`);
            return true;
        }
    } else if (response.freeBottles == 0) {
        appendErrorMessage('#div_nombre_bouteilles', ERROR_CLASSES.errorContainerBottles, 'error-sup-bottles', ERROR_MESSAGES.bottlesMaxReached);
        addBorderError('#nombre_bouteilles')
        return false;
    } else {
        appendErrorMessage('#div_nombre_bouteilles', ERROR_CLASSES.errorContainerBottles, 'error-sup-bottles', ERROR_MESSAGES.bottlesSup);
        addBorderError('#nombre_bouteilles');
        return false;
    }
    return false;
}

async function checkInputs() {
    var isEmailValid = checkEmailAddress();
    var isDateValid = checkDate(document.querySelector('#date_depot').value).isValid;
    var isOperationValid = checkOperation();
    var isUniteValid = checkUnite();
    var isNbBottlesFilled = checkEmptyBottlesInput();
    var isNbBottlesValid = isNbBottlesFilled ? await checkBottles() : false;

    return isEmailValid && isDateValid && isOperationValid && isUniteValid && isNbBottlesValid;
}

document.addEventListener('DOMContentLoaded', function () {

    if(checkDate(document.querySelector('#date_depot').value).isValid){
        checkBottles();
    }

    var formSubmitHandler = async function (event) {
        event.preventDefault();
        var check = await checkInputs();
        if (check) {
            this.removeEventListener('submit', formSubmitHandler);
            this.submit();
        }
    };

    document.querySelector('#book_form').addEventListener('submit', formSubmitHandler);

    document.querySelector('#date_depot').addEventListener('change', function () {
        var check = checkDate(this.value);

        if (document.querySelector(`.${ERROR_CLASSES.errorContainer}`)) {
            removeErrorMessage(ERROR_CLASSES.errorContainer);
            removeBorderError('#date_depot', ERROR_CLASSES.borderError);
        }
        if (check.isValid) {
            checkBottles();
        } else if (check.error === 'error-empty') {
            appendErrorMessage('#div_date_depot', ERROR_CLASSES.errorContainer, 'error-empty', ERROR_MESSAGES.dateEmpty);
            addBorderError('#date_depot');
        } else if (check.error === 'error-inf-weekend') {
            appendErrorMessage('#div_date_depot', ERROR_CLASSES.errorContainer, 'error-inf-weekend', ERROR_MESSAGES.dateInfWeekend);
            addBorderError('#date_depot');
        } else if (check.error === 'error-inf') {
            appendErrorMessage('#div_date_depot', ERROR_CLASSES.errorContainer, 'error-inf', ERROR_MESSAGES.dateInf);
            addBorderError('#date_depot');
        } else if (check.error === 'error-weekend') {
            appendErrorMessage('#div_date_depot', ERROR_CLASSES.errorContainer, 'error-weekend', ERROR_MESSAGES.dateWeekend);
            addBorderError('#date_depot');
        } else {
            addBorderError('#date_depot');
        }
    });

    document.querySelector('#email').addEventListener('change', checkEmailAddress);
    document.querySelector('#operation').addEventListener('change', checkOperation);
    document.querySelector('#unite').addEventListener('change', checkUnite);
    document.querySelector('#nombre_bouteilles').addEventListener('change', checkBottles);
});


