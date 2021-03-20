import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import koaPino from 'koa-pino-logger'
import logger from './libs/logger'
import config from './libs/config'
import { initDatabase } from './libs/database'

import machineRouter from './machines'

const app = new Koa()

app.context.initDatabase = async () => {
  await initDatabase(config.database, () => {
    logger.info('👌 Connected to database successfully')
  })
}
app.use(helmet())
app.use(cors())
app.use(bodyParser())
app.use(koaPino({ logger }))
app.use(async (ctx: Koa.Context, next: () => void) => {
  try {
    await next()
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      statusCode: ctx.status,
      error: err.error,
      message: err.message,
    }
  }
})

app.use(machineRouter.routes()).use(machineRouter.allowedMethods())

export default app
