import Router from 'koa-router'

import assistantRoute from './assistant/index'

const router = new Router()

router.use('/assistant', assistantRoute.routes())

export default router