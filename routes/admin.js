const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const segredo = process.env.JWT_SECRET
const { Sequelize, sequelize, Cliente, Pedido, Produto } = require('../db/db_config');
const Joi = require('joi');
require('dotenv').config();

const schema = Joi.object({
  primeiro_nome: Joi.string().min(3).max(30),
  usuario: Joi.string().required(),
  senha: Joi.string().min(5).required()
});

const schemaatualizar = Joi.object({
  primeiro_nome: Joi.string().min(3).max(30),
  usuario: Joi.string().required(),
  senha: Joi.string().min(5).required()
});

function authenticateToken(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ error: "Token de autorização não fornecido" });

  jwt.verify(token, segredo, (err, user) => {
    if (err)
      return res.status(403).json({ error: "Falha na autenticação do token" });
    req.user = user;
    next();
  });
}

async function authorizeAdmin(req, res, next) {
 
  try {
    const usuarioExistente = await Cliente.findOne({
      where: { usuario: req.user.nome },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (usuarioExistente.isAdmin) {
      next();
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }
  } catch (error) {
   
    return res
      .status(500)
      .json({ error: "Erro interno do servidor ao verificar autorização" });
  }
}

router.post("/criar", authenticateToken, authorizeAdmin, async function(req, res){
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const { primeiro_nome, usuario, senha } = req.body;

    if (!primeiro_nome || !usuario || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios para criar admin" });
    }

    await Cliente.create({
      primeiro_nome: primeiro_nome,
      usuario: usuario,
      senha: senha,
      isAdmin: true,
    });
    return res.status(200).json({ message: "Registr de um admin realizado com sucesso" });
  } catch (err) {
   
    return res.status(500).json({ error: "Erro ao realizar registro" });
  }
})
router.put(
  "/alterar/:nome_usuario",
  authenticateToken,
  authorizeAdmin,
  async function (req, res) {
    const nomeUsuario = req.params.nome_usuario;
    const novosDadosUsuario = req.body; 

  const { error } = schemaatualizar.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
    try {
      
      const usuarioExistente = await Cliente.findOne({
        where: { usuario: nomeUsuario },
      });
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

    
      await Cliente.update(novosDadosUsuario, {
        where: { usuario: nomeUsuario },
      });

      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
     
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao atualizar usuário" });
    }
  }
);

router.delete(
  "/deletar/:nome_usuario",
  authenticateToken,
  authorizeAdmin,
  async function (req, res) {
    const nomeUsuario = req.params.nome_usuario;

    try {
     
      const usuarioExistente = await Cliente.findOne({
        where: { usuario: nomeUsuario },
      });
      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }


      await Cliente.destroy({ where: { usuario: nomeUsuario } });


      return res.status(200).json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
     
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao excluir usuário" });
    }
  }
);

module.exports = router;
