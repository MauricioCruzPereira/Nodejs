const Sequelize = require("sequelize")
const connection = require("../database/database")

const User = connection.define('users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

//forçar a criação da tabela no banco de dados
User.sync({ force: false })

module.exports = User