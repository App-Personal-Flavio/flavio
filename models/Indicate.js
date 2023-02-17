const Sequelize = require('sequelize');
const db = require('./db.js');

//criar uma tabela pra guardar os dados de quem indicou o usuário
const Indicate = db.define('indicacao', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_indicado: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

//Criar a tabela
Indicate.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// User.sync({ alter: true })
//Exportar o módulo
module.exports = Indicate;
