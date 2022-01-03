const express = require("express")
//definar as rotas
const router = express.Router()
//usado para mexer com o banco de dados
const User = require("../models/User")
//criptografar a senha
const bcrypt = require("bcryptjs")
//verificação com funcao
const userAuth = require("../middlewares/userAuth")


router.get("/users/new", (req, res) => {
    var nameError = req.flash("nameError")
    var emailError = req.flash("emailError")
    var passwordError = req.flash("passwordError")
    var createSuccess = req.flash("createSuccess")
    var emailRegistered = req.flash("emailRegistered")

    var name = req.flash("name")
    var email = req.flash("email")

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError
    nameError = (nameError == undefined || nameError.length == 0) ? undefined : nameError

    name = (name == undefined || name.length == 0) ? "" : name
    email = (email == undefined || email.length == 0) ? "" : email

    createSuccess = (createSuccess == undefined || createSuccess.length == 0) ? "" : createSuccess
    emailRegistered = (emailRegistered == undefined || emailRegistered.length == 0) ? "" : emailRegistered

    res.render("users/new", { emailError, nameError, passwordError, name: name, email: email, createSuccess, emailRegistered })
})

router.post("/users/create", (req, res) => {
    var { name, email, password } = req.body

    var nameError
    var emailError
    var passwordError

    if (name == "" || name == undefined) {
        nameError = "Nome não pode ser vazio"
    }

    if (email == "" || email == undefined) {
        emailError = "Email não pode ser vazio"
    }

    if (password.length < 5) {
        passwordError = "Senha muito curta"
    }

    if (password == "" || password == undefined) {
        passwordError = "Senha não pode ser vazia"
    }

    if (email != "" && name != "" && password != "" && password.length >= 5) {
        User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user == undefined) {
                var salt = bcrypt.genSaltSync(10)
                var hash = bcrypt.hashSync(password, salt)

                User.create({
                    name,
                    email,
                    password: hash,
                    admin: false
                }).then(() => {
                    var createSuccess = "Cadastrado com sucesso"

                    req.flash("createSuccess", createSuccess)
                    res.redirect("/users/new")
                }).cath(() => {
                    res.redirect("/users/new")
                })
            }
            else {
                var emailRegistered = "Email já registrado"

                req.flash("emailRegistered", emailRegistered)
                res.redirect("/users/new")
            }
        })
    }
    else {
        req.flash("emailError", emailError)
        req.flash("nameError", nameError)
        req.flash("passwordError", passwordError)

        req.flash("email", email)
        req.flash("name", name)

        res.redirect("/users/new")
    }
})
router.get("/users/login", (req, res) => {
    var emailError = req.flash("emailError")
    var passwordError = req.flash("passwordError")
    var email = req.flash("email")

    var passwordIncorrect = req.flash("passwordIncorrect")
    var emailIncorrect = req.flash("emailIncorrect")

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError

    email = (email == undefined || email.length == 0) ? "" : email

    passwordIncorrect = (passwordIncorrect == undefined || passwordIncorrect.length == 0) ? "" : passwordIncorrect
    emailIncorrect = (emailIncorrect == undefined || emailIncorrect.length == 0) ? "" : emailIncorrect


    res.render("users/login", { emailError, passwordError, email: email, passwordIncorrect, emailIncorrect })
})

router.post("/auth", (req, res) => {
    const { email, password } = req.body

    var emailError
    var passwordError

    if (email == "" || email == undefined) {
        emailError = "Email não pode ser vazio"
    }

    if (password == "" || password == undefined) {
        passwordError = "Senha não pode ser vazia"
    }

    req.flash("email", email)

    if (email != "" && password != "") {

        //procurar por um usuário com uma condição
        User.findOne({
            where: {
                email
            }
        }).then(user => {
            if (user != undefined) {

                //bcrypt vai comparar a senha digita e a senha no banco de dados
                //caso retonar um valor ela existe, caso n, ela n existe
                var correct = bcrypt.compareSync(password, user.password)

                if (correct) {
                    req.session.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin
                    }
                    //testar
                    //res.json(req.session.user)
                    res.redirect("/users/index")
                }
                else {
                    var passwordIncorrect = "Email ou senha incorretas"
                    req.flash("passwordIncorrect", passwordIncorrect)
                    res.redirect("/users/login")

                }
            }
            else {
                var emailIncorrect = "Email ou senha incorretas"
                req.flash("emailIncorrect", emailIncorrect)
                res.redirect("/users/login")
            }
        })
    }
    else {
        req.flash("emailError", emailError)
        req.flash("passwordError", passwordError)

        res.redirect("/users/login")
    }
})

router.get("/users/index", userAuth, (req, res) => {
    res.render("users/index", { user: req.session.user })
})

router.get("/logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router