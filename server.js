const http = require('http')
const app = require('./app')
const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT || 5010
const hostname = process.env.HOSTNAME
const server = http.createServer(app)

server.listen(port, hostname, () => console.log(`Server is running at http://${hostname}:${port}`))