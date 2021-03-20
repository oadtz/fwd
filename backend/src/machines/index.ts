import { Context } from 'koa'
import Router from 'koa-router'

const router = new Router({
  prefix: '/machines',
})

router.get(
  '/',
  async (ctx: Context): Promise<void> => {
    ctx.body = 'MACHINES'
  }
)

export default router
