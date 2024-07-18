module.exports = {
    update: update,
    deleteReservation: deleteReservation
}

const db = require('../models/default');

function update(req, res){
    if(req.session.isAdmin){

        let email = req.body.email;
        let unite = req.body.unite;
        let operation = req.body.operation;
        let date_depot = req.body.date_depot;
        let nombre_bouteilles = req.body.nombre_bouteilles;
        let commentaires = req.body.commentaires;
        let id = req.params.id;

        let result = db.edit.updateReservation(id, email, unite, operation, date_depot, nombre_bouteilles, commentaires);

        result.then(() => {
            res.status(200).redirect('/admin');
        }).catch((err) => {
            console.log(err);
        });
    }
    else res.status('4O1').redirect('/');
}

function deleteReservation(req, res){
    if(req.session.isAdmin){
        let result = db.edit.deleteReservation(req.params.id);

        result.then(() => {
            res.status(200).redirect('/admin');
        }).catch((err) => {
            console.log(err);
        });
    }
    else res.status('4O1').redirect('/');
}