//Criar uma tabela pra registrar alteração de peso
const Sequelize = require('sequelize');
const db = require('./db.js');
const Weight = db.define('peso', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    peso: {
        type: Sequelize.STRING,
        allowNull: false
    },
    massa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
//Criar a tabela
Weight.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Weight.sync({ alter: true })
//Exportar o módulo
module.exports = Weight;
