const { Pedido, Produto, Cliente } = require('../db/db_config');

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [Produto, Cliente],
    });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
};

exports.criarPedido = async (req, res) => {
  try {
    const { clienteId, data, produtos } = req.body;

  
    const produtosEncontrados = await Produto.findAll({ where: { id: produtos } });
    let total = produtosEncontrados.reduce((nada, produto) => nada + produto.preco, 0);


    let desconto = 0;
    if (produtos.length > 1) {
      desconto = 0.20; 
    } else if (produtos.length === 1) {
      desconto = 0.10; 
    }
    total = total - (total * desconto);

    const pedido = await Pedido.create({ clienteId, data, total });
    await pedido.setProdutos(produtos);

    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
};


exports.atualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const {  data, status, total, produtos } = req.body;

    const pedido = await Pedido.findByPk(id);
    if (pedido) {
      await pedido.update({ data, status, total });

      if (produtos && produtos.length) {
        await pedido.setProdutos(produtos);
      }

  
      const produtosEncontrados = await Produto.findAll({ where: { id: produtos } });
      let novoTotal = produtosEncontrados.reduce((nada, produto) => nada + produto.preco, 0);

      let desconto = 0;
      if (produtos.length > 1) {
        desconto = 0.20; 
      } else if (produtos.length === 1) {
        desconto = 0.10; 
      }
      novoTotal = novoTotal - (novoTotal * desconto);

      await pedido.update({ total: novoTotal });

      res.json(pedido);
    } else {
      res.status(404).json({ error: "Pedido não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar pedido" });
  }
};


exports.deletarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);
    if (pedido) {
      await pedido.destroy();
      res.json({ message: "Pedido deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Pedido não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar pedido" });
  }
};
