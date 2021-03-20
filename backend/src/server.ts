import app from './app'
import config from './libs/config'
import logger from './libs/logger'

const { port } = config

app.listen(port, () => {
  logger.info(`🚀 App listening on the port ${port}`)

  app.context.initDatabase()
})
