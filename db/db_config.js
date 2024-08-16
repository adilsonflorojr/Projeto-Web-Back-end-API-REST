
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NADA, process.env.DB_USER,process.env.DB_PASSWORD, {
    host:  process.env.DB_HOST,
    dialect:process.env.DB_DB
  });
  const Cliente = sequelize.define('Cliente', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    primeiro_nome: {
        type: Sequelize.STRING,
    },
    usuario: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        primaryKey: true,
        
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false 
    },
    contador: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

const Pedido = sequelize.define('Pedido', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    data: {
        type: Sequelize.DATE,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'pedidofoifeito :D',
    },
    total: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    nome_cliente: {
        type: Sequelize.TEXT,
    }
});

const Produto = sequelize.define('Produto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT
    },
    preco: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    estoque: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
});


Cliente.hasMany(Pedido); 
Pedido.belongsTo(Cliente); 

Pedido.belongsToMany(Produto, { through: 'PedidoProdutotabela' }); 
Produto.belongsToMany(Pedido, { through: 'PedidoProdutotabela' }); 

  module.exports = {
    Sequelize,
    sequelize,
    Cliente,
    Pedido,
    Produto
  };