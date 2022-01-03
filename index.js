const express = require("express")
const app = express()
const connection = require("./database/database")
const session = require("express-session")
//expres-flash
const flash = require("express-flash")

const cookieParser = require("cookie-parser")

//controllers
const usersController = require("./controllers/usersController")
const adminController = require("./controllers/adminController")

//users
const User = require("./models/User")

app.set('view engine', 'ejs')

//arquivos staticos (img,css,etc)
app.use(express.static('public'))

//pegar dados do formulário
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser("cfmsdanioudfkshniksd"))
//session

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 40000 }
}))

//express-flash
app.use(flash())

//banco de dados
connection.authenticate().then(() => {
    console.log("Conexão feita com sucesso")
}).catch((error) => {
    console.log(error)
})

//controllers
app.use("/", usersController)
app.use("/", adminController)

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/*", (req, res) => {
    res.redirect("/")
})

app.listen(1616, () => {
    console.log("Serve iniciando")
})