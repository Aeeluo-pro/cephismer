module.exports = {
    logout: logout
}

function logout(req, res) {
    req.session.destroy();
    res.clearCookie('reservation');
    res.status(200).render('logout');
}