function adminAuth(req, res, next) {
    if (req.session.user != undefined && req.session.user.admin == 1) {
        next()
    }
    else {
        res.redirect("/users/index")
    }
}

module.exports = adminAuth