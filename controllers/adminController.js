const express = require("express")
//definar as rotas
const router = express.Router()
//usado para mexer com o banco de dados
const User = require("../models/User")
//verificao do usuario
const adminAuth = require("../middlewares/adminAuth")

const userAuth = require("../middlewares/userAuth")

router.get("/admin", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/index", { users: users })
    })

})

router.post("/admin/delete", adminAuth, (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {
            //usado para deletar um usuário apartir de uma condição
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin")
            })
        } else {
            //n for um número(parametroaleatorio)
            res.redirect("/admin")
        }
    }
    else {
        //valor nullo
        res.redirect("/admin")
    }
})

module.exports = router