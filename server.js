const http = require('http')
const app = require('./app')
let config = require('./config/config')

if(process.env.NODE_ENV === 'development'){
  config = config.dev.app
}

const server = http.createServer(app)

server.listen(config.port , config.hostname, () => console.log(`Server is running at http://${config.hostname}:${config.port}`))