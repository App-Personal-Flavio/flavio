//Criar a tabela de categorias de treino do instrutor
const Sequelize = require('sequelize');
const db = require('./db.js');
const Category = db.define('categoria', {
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
    usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
//Criar a tabela
Category.sync();
//Verificar se há alguma diferença na tabela, realiza a alteração
// Category.sync({ alter: true })
//Exportar o módulo
module.exports = Category;

