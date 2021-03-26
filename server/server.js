import Koa from 'koa'
import path from 'path'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import ip from 'ip'

import router from './routes/index'

const app = new Koa()

app.use(bodyParser())

    .use(serve(path.join(__dirname + '/views/')))

    .use(async (ctx, next) => {
        try {
            await next()
        } catch (err) {
            ctx.response.status = err.statusCode || err.status || 500
            ctx.response.type = 'html'
            ctx.response.body = '<p>出错啦</p>'
            ctx.app.emit('error', err, ctx)
        }
    })

    .use(router.routes())

    .use(router.allowedMethods())

    .on('error', (err) => {
        console.error('server error:', err)
    })

    .listen(30000, () => {
        console.log(`server is starting at ${ip.address()}:30000`)
    })

export default app