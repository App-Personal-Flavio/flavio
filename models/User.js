//User.js para registrar os dados de usuário (nome, email, senha, cpf, cidade)
const Sequelize = require('sequelize');
const db = require('./db.js');
const User = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cidade: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    foto: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//Criar a tabela
User.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// User.sync({ alter: true })
//Exportar o módulo
module.exports = User;