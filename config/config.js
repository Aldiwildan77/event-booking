const dotenv = require('dotenv')
const result = dotenv.config()

if (result.error) {
  throw result.error
}

const dev = {
  app: {
    port: parseInt(process.env.PORT) || 5010,
    hostname: process.env.HOSTNAME || 'localhost'
  },
  db: {
    host: process.env.DEV_MONGO_USER || 'your_db_host',
    name: process.env.DEV_MONGO_DB || 'your_db_name',
    password: process.env.DEV_MONGO_PASSWORD,
  },
  auth: {
    key: process.env.DEV_PRIVATE_KEY_JWT
  }
}

const prod = {
  app: {
    port: parseInt(process.env.PORT) || 5010,
    hostname: process.env.HOSTNAME || 'your_hostname_prod'
  },
  db: {
    host: process.env.PROD_MONGO_USER || 'your_db_host',
    name: process.env.PROD_MONGO_DB || 'your_db_name',
    password: process.env.PROD_MONGO_PASSWORD,
  },
  auth: {
    key: process.env.PROD_PRIVATE_KEY_JWT
  }
}

const test = {
  app: {
    port: parseInt(process.env.PORT) || 5010,
    hostname: process.env.HOSTNAME || 'your_hostname_test'
  },
  db: {
    host: process.env.TEST_MONGO_USER || 'your_db_host',
    name: process.env.TEST_MONGO_DB || 'your_db_name',
    password: process.env.TEST_MONGO_PASSWORD,
  },
  auth: {
    key: process.env.TEST_PRIVATE_KEY_JWT
  }
}

const config = {
  dev,
  prod,
  test
}

module.exports = config