const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Joi = require('joi');
let segredo = process.env.JWT_SECRET;
require('dotenv').config();
const atualizaSchema = Joi.object({
  primeiro_nome: Joi.string(),
  usuario: Joi.string().required(),
  senha: Joi.string().min(4).required(),

});


const {
  Sequelize,
  sequelize,
  Cliente,
  Pedido,
  Produto,
} = require("../db/db_config");

async function authenticateToken(req, res, next) {
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

async function authorizeUpdate(req, res, next) {
  const { nome_usuario } = req.params;

  try {
    const usuarioExistente = await Cliente.findOne({
      where: { usuario: req.user.nome },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (usuarioExistente.isAdmin || req.user.nome === nome_usuario) {
      next();
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }
  } catch (error) {
   
    return res
      .status(500)
      .json({ error: "Erro internoservidor ao verificar autorização" });
  }
}

async function authorizeDelete(req, res, next) {
  const  nome_usuario  = req.params.nome_usuario;

  try {
    const usuarioExistente = await Cliente.findOne({
      where: { usuario: req.user.nome },
    });

    if (!usuarioExistente) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (usuarioExistente.isAdmin || req.user.nome === nome_usuario) {
      next();
    } else {
      return res.status(403).json({ error: "Acesso negado" });
    }
  } catch (error) {
   
    return res
      .status(500)
      .json({ error: "Erro interno do servidor autorização :/" });
  }
}
router.get(
  "/paginaautenticada",
  authenticateToken,

  async function (req, res) {
    try {
      return res.status(200).json({
        message: "Bem vindo a pagina que so é para usuarios autenticados/ autorizados :D",
      });
      
    } catch (error) {
      res.status(500).json({ error: "Erro" });
    }
  }
);
router.get(
  "/",
  authenticateToken,
  authorizeUpdate,
  async function (req, res) {
    try {
      const clientes = await Cliente.findAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar produtos :/" });
    }
  }
);
router.put(
  "/:nome_usuario",
  authenticateToken,
  authorizeUpdate,
  async function (req, res) {
    const nomeUsuario = req.params.nome_usuario;
    const novosDadosUsuario = req.body;
    const { error } = atualizaSchema.validate(novosDadosUsuario);
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

      await Cliente.findOne({
        where: { usuario: nomeUsuario },
      });

      return res.status(200).json({
        message: "Usuário atualizado com sucesso :D",
      });
    } catch (error) {
     
      return res
        .status(500)
        .json({ error: "ErRO servidor ao atualizar usuário" });
    }
  }
);
router.delete(
  "/delete/:nome_usuario",
  authenticateToken,
  authorizeDelete,
  async function (req, res) {
    const nomeUsuario = req.params.nome_usuario;

    try {
      const usuarioExistente = await Cliente.findOne({
        where: { usuario: nomeUsuario },
      });

      if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuário nãoencontrado" });
      }

      await Cliente.destroy({
        where: { usuario: nomeUsuario },
      });

      return res.status(200).json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
     
      return res
        .status(500)
        .json({ error: "Erro do servidor ao deletar o tal usuário" });
    }
  }
);

module.exports = router;
