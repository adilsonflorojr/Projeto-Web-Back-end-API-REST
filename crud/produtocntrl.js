const { Produto } = require('../db/db_config');

exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};


exports.criarProduto = async (req, res) => {
  
  try {
    const { nome, descricao, preco, estoque } = req.body;
    const produto = await Produto.create({ nome, descricao, preco, estoque });
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};


exports.atualizarProduto = async (req, res) => {
  
  try {
    const { id } = req.params;
    const { nome, descricao, preco, estoque } = req.body;
    const produto = await Produto.findByPk(id);
    if (produto) {
      await produto.update({ nome, descricao, preco, estoque });
      res.json(produto);
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};


exports.deletarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);
    if (produto) {
      await produto.destroy();
      res.json({ message: "Produto deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Produto não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
};
