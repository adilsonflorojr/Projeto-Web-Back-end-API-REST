
# Projeto Final API REST - Sistema de Gerenciamento de Pedidos

Este projeto consiste em uma API REST desenvolvida para gerenciar um sistema de pedidos. A aplicação abrange o cadastro de usuários, autenticação via JWT, e operações CRUD (Create, Read, Update, Delete) para gerenciar pedidos e produtos.

# Tecnologias Utilizadas
- Node.js,

- Express.Js,

- Sequelize,

- PostgreSQL: Banco de dados relacional utilizado,

- JWT (JSON Web Tokens): Autenticação e autorização de usuários,

- Joi: Validação de dados,

- Swagger: Documentação da API

# Funcionalidades
### Usuários e Sistema de Autenticação
- Cadastro de Usuários: Rota dedicada para registrar novos usuários.,

- Login:  Rota que aceita as credenciais do usuário (nome de usuário e senha) e retorna um token JWT para acessar as rotas protegidas

- Usuário Administrador: Administradores têm privilégios adicionais, como alterar e excluir usuários, além de criar novos administradores. Um administrador é configurado automaticamente durante a instalação do sistema.

- Alteração de Dados Pessoais: Usuários podem atualizar suas informações. Administradores têm a permissão de alterar os dados de qualquer usuário.

### CRUD

- Permite a realização de operações CRUD para pedidos e produtos, que apresentam um relacionamento de muitos-para-muitos entre si.
- As operações de inserção, alteração e exclusão são restritas para usuários autenticados com um token válido.

#### Pedidos
- Listar pedidos

- Criar pedido

- Atualizar pedido

- Deletar pedido

#### Produtos

- Listar produtos

- Criar produto

- Atualizar produto

- Deletar produto

# Lógica de Negócio, Instalador e Documentação
- Implementação de lógica de negócio que envolve descontos em pedidos com base na quantidade de produtos.

- Instalador: Rota GET /install que realiza a instalação do banco de dados, criação das tabelas e inserção de dados.

- Documentação: Rota GET /docs contendo a documentação gerada pelo Swagger.