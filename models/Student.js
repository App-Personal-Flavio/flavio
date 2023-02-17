const Sequelize = require('sequelize');
const db = require('./db.js');

//criar uma tabela pra guardar a relação entre o usuário e o usuário tipo 2 (profissional)
const Student = db.define('aluno_professor', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_aluno: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_professor: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});



//Criar a tabela
Student.sync();

//Verificar se há alguma diferença na tabela, realiza a alteração
// Student.sync({ alter: true })
//Exportar o módulo
module.exports = Student;
