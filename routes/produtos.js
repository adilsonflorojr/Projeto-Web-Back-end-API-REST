const express = require('express');
const router = express.Router();
const produtoController = require('../crud/produtocntrl');
const jwt = require("jsonwebtoken");
const segredo = process.env.JWT_SECRET
const { Sequelize, sequelize, Cliente, Pedido, Produto } = require('../db/db_config');
const Joi = require('joi');
require('dotenv').config();

async function authenticateToken(req, res, next) {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
  
    if (!token)
      return res
        .status(401)
        .json({ error: "Token de autorização não fornecido" });
  
    jwt.verify(token, segredo, (err, user) => {
      if (err)
        return res.status(403).json({ error: "Falha na autenticação doToken" });
  
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
        .json({ error: "Erro interno do servidor  autorização" });
    }
  }
  
  async function authorizeDelete(req, res, next) {
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
      console.error("Erro ao verificar autorização:", error);
      return res
        .status(500)
        .json({ error: "Erro interno do servidor ao verificar autorização" });
    }
  }
  
async function authorizeAdminGet(req, res, next) {
 
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
        .json({ error: "Erro interno do servidor autorização" });
    }
  }

router.get('/', authenticateToken, authorizeAdminGet, produtoController.listarProdutos);


router.post('/', authenticateToken, produtoController.criarProduto);


router.put('/:id', authenticateToken, authorizeUpdate, produtoController.atualizarProduto);


router.delete('/:id',authenticateToken, authorizeDelete, produtoController.deletarProduto);

module.exports = router;
