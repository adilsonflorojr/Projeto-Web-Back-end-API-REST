const express = require("express");
const app = express();
require('dotenv').config();

const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth").router;
const userRoutes = require("./routes/user");
const pedidoRoutes = require("./routes/pedidos");
const produtoRoutes = require("./routes/produtos");


const { Sequelize, sequelize, Cliente, Pedido, Produto } = require('./db/db_config');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/admin", adminRoutes);
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/produtos", produtoRoutes);

const swaggerUI = require("swagger-ui-express")
const swaggerdoc = require('./swagger_doc.json')
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerdoc))

app.get("/install", async function (req, res) {
    try {
        await sequelize.sync({ force: true });
       
  
        
        const clientes = await Cliente.bulkCreate([
            { primeiro_nome: "Admin", usuario: "admin", senha: "admin", isAdmin: true },
            { primeiro_nome: "Pessoaaaleatoria1", usuario: "aleatorio1", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria2", usuario: "aleatorio2", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria3", usuario: "aleatorio3", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria4", usuario: "aleatorio4", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria5", usuario: "aleatorio5", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria6", usuario: "aleatorio6", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria7", usuario: "aleatorio7", senha: "senha" },
            { primeiro_nome: "Pessoaaaleatoria8", usuario: "aleatorio8", senha: "senha" }
        ]);
       
       
        const produtos = await Produto.bulkCreate([
            { nome: "Produto 1", descricao: "Descrição 1", preco: 10.0, estoque: 100 },
            { nome: "Produto 2", descricao: "Descrição 2", preco: 20.0, estoque: 200 },
            { nome: "Produto 3", descricao: "Descrição 3", preco: 30.0, estoque: 300 },
            { nome: "Produto 4", descricao: "Descrição 4", preco: 40.0, estoque: 400 },
            { nome: "Produto 5", descricao: "Descrição 5", preco: 50.0, estoque: 500 },
            { nome: "Produto 6", descricao: "Descrição 6", preco: 60.0, estoque: 600 },
            { nome: "Produto 7", descricao: "Descrição 7", preco: 70.0, estoque: 700 },
            { nome: "Produto 8", descricao: "Descrição 8", preco: 80.0, estoque: 800 }
        ]);
       
        const pedidos = await Pedido.bulkCreate([
            { data: new Date(), status: "pedidofoifeito :D", total: 40, nome_cliente: clientes[1].usuario },
            { data: new Date(), status: "pedidofoifeito :D", total: 40,  nome_cliente: clientes[2].usuario },
            { data: new Date(), status: "pedidofoifeito :D", total: 36,  nome_cliente: clientes[3].usuario },
            { data: new Date(), status: "pedidofoifeito :D", total: 54,  nome_cliente: clientes[4].usuario },
            { data: new Date(), status: "pedidofoifeito :D", total: 32,  nome_cliente: clientes[5].usuario },
            { data: new Date(), status: "pedidofoifeito :D", total: 32,  nome_cliente: clientes[6].usuario},
            { data: new Date(), status: "pedidofoifeito :D", total: 80,  nome_cliente: clientes[7].usuario },
            { data: new Date(), status: "pedidofoifeito :D", total: 96, nome_cliente: clientes[8].usuario}
          
        ]);
       
  
    
        await pedidos[0].setProdutos([produtos[3], produtos[2]]);
        await pedidos[1].setProdutos([produtos[2], produtos[3]]);
        await pedidos[2].setProdutos([produtos[4]]);
        await pedidos[3].setProdutos([produtos[6]]);
        await pedidos[4].setProdutos([produtos[2], produtos[3]]);
        await pedidos[5].setProdutos([produtos[1], produtos[3]]);
        await pedidos[6].setProdutos([produtos[4], produtos[6]]);
        await pedidos[7].setProdutos([produtos[5], produtos[7]]);
       
  
        res.json("Banco instalado com sucesso. :D");
    } catch (error) {
       
        res.status(500).json({ error: "Erro ao instalar o banco de dados :(" });
    }
  });
  

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
