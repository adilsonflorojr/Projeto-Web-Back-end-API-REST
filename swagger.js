const swaggerAutogen = require('swagger-autogen')()
output = './swagger_doc.json'
endpoints = ['./routes/admin.js', './routes/auth.js', './routes/pedidos.js', './routes/produtos.js', './routes/user.js']
const doc = {
    info: {
        version:'1.0',
        title:'Api Rest',
        description:'API REST para gerenciamento de pedidos',

    },
    
}
swaggerAutogen(output, endpoints, doc)