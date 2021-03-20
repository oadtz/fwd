import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export default {
  appURL: process.env.APP_URL,
  port: process.env.PORT || 4000,
  database: {
    uri: process.env.DB_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME,
    prefix: process.env.DB_PREFIX || '',
  },
}
