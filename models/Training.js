//Criar uma tabela de treino
const Sequelize = require('sequelize');
const db = require('./db.js');
const Training = db.define('treino', {
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
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    categoria: {
        type: Sequelize.STRING,
        allowNull: false
    },
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
//Criar a tabela
Training.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Training.sync({ alter: true })
//Exportar o módulo
module.exports = Training;
