const express = require("express");
const router = express.Router();
const { Sequelize, sequelize, Cliente, Pedido, Produto } = require('../db/db_config');
const jwt = require("jsonwebtoken");
const segredo = process.env.JWT_SECRET
const Joi = require('joi');
require('dotenv').config();

const cadastroSchema = Joi.object({
  primeiro_nome: Joi.string().min(3).max(30).required(),
  usuario: Joi.string().required(),
  senha: Joi.string().min(5).required()
});

const loginSchema = Joi.object({
  usuario: Joi.string().required(),
  senha: Joi.string().min(5).required()
});

router.post("/register", async function (req, res) {
  
  const { error } = cadastroSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { primeiro_nome, usuario, senha } = req.body;

    if (!primeiro_nome || !usuario || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    await Cliente.create({
      primeiro_nome: primeiro_nome,
      usuario: usuario,
      senha: senha,
      isAdmin: false,
    });
    return res.status(200).json({ message: "Registro realizado com sucesso :D" });
  } catch (err) {
    
    return res.status(500).json({ error: "Erro ao realizar registro :(" });
  }
});

router.post("/login", async function (req, res) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  
  
  try {
    const { usuario, senha } = req.body;
 
    const user = await Cliente.findOne({ where: { usuario } });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (senha === user.senha) {
      token = jwt.sign( 
        {
          nome: usuario,
        },
        segredo,
        { expiresIn: 6000000 }
      );

      return res.status(200).json({ token: token }); 
    } else {
     
      return res.status(401).json({ error: "Senha incorreta" });
    }
  } catch (error) {
   
    return res.status(500).json({ error: "Erro interno doservidor" });
  }
});
module.exports = {
  router: router, 
  
};
