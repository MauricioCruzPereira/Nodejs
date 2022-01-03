const Sequelize = require("sequelize")

const connection = new Sequelize('(nome do seu banco de dados)', 'root', '(suasenha)', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection