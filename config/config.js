require('dotenv').config()

const env = process.env.NODE_ENV

const dev = {
  app: {
    port: parseInt(process.env.PORT) || 5010,
    hostname: process.env.HOSTNAME || 'localhost'
  },
  db: {
    host: process.env.MONGO_USER || 'your_db_host',
    name: process.env.MONGO_DB || 'your_db_name',
    password: process.env.MONGO_PASSWORD || 'your_db_password',
  }
}

module.exports = {
  dev
}