const http = require('http')
const app = require('./app')
const config = require('./config/config').dev.app

const server = http.createServer(app)

server.listen(config.port , config.hostname, () => console.log(`Server is running at http://${config.hostname}:${config.port}`))