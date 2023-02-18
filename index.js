const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Importar o Categoria
const Category = require('./models/Category');

//Importart o Indicate
const Indicate = require('./models/Indicate');

//Importar o Treino
const Training = require('./models/Training');

//Importar o peso

const Weight = require('./models/Weight');

async function isAuthorized(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(200).json({ error: true, message: 'Token não fornecido' });
        }
        // Verificando o token
        const decoded = jwt.verify(token, 'flaviocliente_versao_1.0.0_key_dev');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(200).json({ error: true, message: 'Token inválido' });
    }
}

async function isAuthorizedPersonal(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(200).json({ error: true, message: 'Token não fornecido' });
        }
        // Verificando o token
        const decoded = jwt.verify(token, 'flaviopersonal_versao_1.0.0_key_dev');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(200).json({ error: true, message: 'Token inválido' });
    }
}



app.use(express.json());

// Cadastro


app.post("/cadastro", async (request, response) => {
    const { nome, email, senha, cpf, cidade, tipo, foto } = request.body;
    try {
        const buffer = new Buffer.from(foto.split(',')[1], 'base64');
        const fileName = `${new Date().getTime()}.jpg`;
        const filePath = path.join(__dirname, 'img', fileName);

        fs.writeFileSync(filePath, buffer);
        //Criptografar a senha antes de criar com bcryt
        const hashSenha = await bcrypt.hash(senha, 1);
        // Criando o usuário
        const user = await User.create({
            nome: nome,
            email: email,
            senha: hashSenha,
            cpf: cpf,
            cidade: cidade,
            tipo: tipo,
            foto: fileName
        });
        // Gerando o JWT
        if (tipo == 1) {
            const secret = 'flaviocliente_versao_1.0.0_key_dev';
        }
        else{
            const secret = 'flaviopersonal_versao_1.0.0_key_dev';
        }
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
        response.status(201).json({
            id: user.id,
            nome: user.nome,
            token: token
        });
    } catch (error) {
        response.status(200).send({ error: true, message: "Erro criando usuario" });
    }
});
// login

app.post("/login", async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if (!user || user == null) {
            return res.status(200).json({
                error: true,
                message: "Usuário não encontrado!"
            });
        }
        try {
            var eValido = await bcrypt.compare(senha, user.senha);
            if (eValido) {
                const token = jwt.sign({ userId: user._id }, 'flaviopersonal_versao_1.0.0_key_dev', { expiresIn: '1h' });

                res.status(200).json({
                    id: user.id,
                    nome: user.nome,
                    token: token,
                });
            }
            else {
                return res.status(200).json({
                    error: true,
                    message: "Senha inválida!"
                });
            }
        } catch {
            return res.status(200).json({
                error: true,
                message: "Senha inválida!"
            });

        }
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao autenticar usuário!"
        });
    }
});

// Listar todos os usuários
app.get("/usuarios", isAuthorized, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar usuários!"
        });
    }
}
);

// Listar um usuário
app.get("/usuario/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar usuário!"
        });
    }
});


//Criar um sistema de convite
app.post("/convite", isAuthorized, async (req, res) => {
    const { id_usuario, id_indicado } = req.body;
    try {
        const indicate = await Indicate.create({
            id_usuario: id_usuario,
            id_indicado: id_indicado
        });
        //Consultar quantidade total de convites
        const totalIndicates = await Indicate.count({
            where: {
                id_usuario: id_usuario
            }
        });

        res.status(201).json({
            id: indicate.id,
            id_usuario: indicate.id_usuario,
            id_indicado: indicate.id_indicado,
            totalIndicates: totalIndicates
        });
    } catch (error) {
        res.status(200).send({ error: true, message: "Erro criando convite" });
    }
});

//Listar todos os convites
app.get("/convites", isAuthorized, async (req, res) => {
    try {
        const indicates = await Indicate.findAll();
        res.status(200).json(indicates);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar convites!"
        });
    }
});

//Listar os convites por id_usuario

app.get("/convites/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;
    try {
        const indicate = await Indicate.findAll({
            where: {
                id_usuario: id
            }
        });
        res.status(200).json(indicate);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar convites!"
        });
    }
});
//Criar uma rota de treino
app.post("/treino", isAuthorizedPersonal, async (req, res) => {
    const {id, nome, descricao, categoria, usuario_id } = req.body;
    try {
        const training = await Training.create({
            id: id,
            nome: nome,
            descricao: descricao,
            categoria: categoria,
            usuario_id: usuario_id
        });
        res.status(201).json({
            id: training.id,
            nome: training.nome,
            descricao: training.descricao,
            categoria: training.categoria,
            usuario_id: training.usuario_idp
        });
    } catch (error) {
        res.status(200).send({ error: true, message: "Erro criando treino" });
    }
});

//Listar todos os treinos
app.get("/treinos", isAuthorized, async (req, res) => {
    try {
        const trainings = await Training.findAll();
        res.status(200).json(trainings);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar treinos!"
        });
    }
});

//Listar os treinos por id_usuario
app.get("/treinos/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;
    try {
        const training = await Training.findAll({
            where: {
                usuario_id: id
            }
        });
        res.status(200).json(training);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar treinos!"
        });
    }
});

//Listar os treinos por categoria

app.get("/treinos/categoria/:categoria", isAuthorized, async (req, res) => {
    const { categoria } = req.params;
    try {
        const training = await Training.findAll({
            where: {
                categoria: categoria
            }
        });
        res.status(200).json(training);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar treinos!"
        });
    }
});


//Listar as categorias por id_usuario
app.get("/categorias/:id_usuario", isAuthorized, async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const category = await Category.findAll({
            where: {
                usuario_id: id_usuario
            }
        });
        res.status(200).json(category);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar categorias!"
        });
    }
});

//Criar uma rota de cadastrar categoria
app.post("/categoria", isAuthorizedPersonal, async (req, res) => {
    const { id, nome, usuario_id } = req.body;
    try {
        const category = await Category.create({
            id: id,
            nome: nome,
            usuario_id: usuario_id
        });
        res.status(201).json({
            id: category.id,
            nome: category.nome,
            usuario_id: category.usuario_id
        });
    } catch (error) {
        res.status(200).send({ error: true, message: "Erro criando categoria" });
    }
});

//Criar uma rota de cadastrar peso
app.post("/peso", isAuthorized, async (req, res) => {
    const { id, peso, massa, usuario_id } = req.body;
    try {
        const weight = await Weight.create({
            id: id,
            peso: peso,
            massa: massa,
            usuario_id: usuario_id
        });
        res.status(201).json({
            id: weight.id,
            peso: weight.peso,
            massa: weight.massa,
            usuario_id: weight.usuario_id
        });
    } catch (error) {
        res.status(200).send({ error: true, message: "Erro criando peso" });
    }
});

//Listar todos os pesos
app.get("/pesos", isAuthorized, async (req, res) => {
    try {
        const weights = await Weight.findAll();
        res.status(200).json(weights);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar pesos!"
        });
    }
});

//Listar os pesos por id_usuario
app.get("/pesos/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;
    try {
        const weight = await Weight.findAll({
            where: {
                usuario_id: id
            }
        });
        res.status(200).json(weight);
    } catch (error) {
        res.status(200).json({
            error: true,
            message: "Erro ao listar pesos!"
        });
    }
});













