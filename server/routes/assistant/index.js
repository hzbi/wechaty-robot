import Router from 'koa-router'

import model from '../../model/assistant/index'

const router = new Router()

router.get('/api/schedule-list', async (ctx, next) => {
    const condition = { hasExpired: false }
    const data = await model.find(condition)
    ctx.response.status = 200
    ctx.body = { code: 200, data: data }
    next()
})

router.post('/api/create-schedule', async (ctx, next) => {
    const params = ctx.request.body
    const data = await model.insert(params)
    ctx.body = { code: 200, data: data }
    next()
})

router.post('/api/update-schedule', async (ctx, next) => {
    const condition = { _id: ctx.request.body.id }
    const data = await model.update(condition)
    ctx.response.status = 200
    ctx.body = { code: 200, data: data }
    next()
})

export default router