import "/static/flatpickr/dist/l10n/fr.js";

var suspension_dates = window.suspensionDates || [];

flatpickr("#suspension_dates", {
    mode: "multiple",
    dateFormat: "Y-m-d",
    conjunction: ';',
    locale: 'fr',
    inline: true,
    defaultDate: suspension_dates
});

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".import-container").classList.add("hidden");
    document.querySelector(".suspend-container").classList.add("hidden");
    document.querySelector("#suspend-dates-popup").classList.add("hidden");
    document.querySelector("#suspend-manual-popup").classList.add("hidden");

    document.querySelector("#analysis").addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector(".import-container").classList.remove("hidden");
        document.querySelector(".suspend-container").classList.add("hidden");
        document.querySelector(".dashboard-container").classList.add("hidden");
    });

    document.querySelector("#suspend").addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector(".suspend-container").classList.remove("hidden");
        document.querySelector(".import-container").classList.add("hidden");
        document.querySelector(".dashboard-container").classList.add("hidden");
    });

    document.querySelector("#dashboard").addEventListener('click', function (event) {
        event.preventDefault();
        document.querySelector(".dashboard-container").classList.remove("hidden");
        document.querySelector(".import-container").classList.add("hidden");
        document.querySelector(".suspend-container").classList.add("hidden");
    });

    document.querySelector("#suspend-dates-popup-button").addEventListener('click', function (event) {
        event.preventDefault();
        document.body.classList.add("popup-active");
        document.querySelector("#suspend-dates-popup").classList.remove("hidden");
        document.querySelector("#suspend-manual-popup").classList.add("hidden");
    });

    document.querySelector("#suspend-manual-popup-button").addEventListener('click', function (event) {
        event.preventDefault();
        document.body.classList.add("popup-active");
        document.querySelector("#suspend-dates-popup").classList.add("hidden");
        document.querySelector("#suspend-manual-popup").classList.remove("hidden");
    });

    document.querySelector("#close-suspend-dates-popup").addEventListener('click', function (event) {
        event.preventDefault();
        document.body.classList.remove("popup-active");
        document.querySelector("#suspend-dates-popup").classList.add("hidden");
    });

    document.querySelector("#close-suspend-manual-popup").addEventListener('click', function (event) {
        event.preventDefault();
        document.body.classList.remove("popup-active");
        document.querySelector("#suspend-manual-popup").classList.add("hidden");
    });

    document.getElementById('export-button').addEventListener('click', function() {
        // Download the CSV file
        window.location.href = '/admin/export';

        // Refresh the page after a delay
        setTimeout(function() {
            location.reload();
        }, 1000); // Adjust the delay as needed
    });
});