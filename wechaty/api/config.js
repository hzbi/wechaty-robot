/**
 * 配置访问后端接口的域名端口
 */
let interfaceUrl = ''

var env = process.env.NODE_ENV == 'development' ? 'development' : 'production'

switch (env) {
    case 'development':
        interfaceUrl = 'http://192.168.27.33:30000/'
        break
    case 'production':
        interfaceUrl = 'http://106.14.10.18/'
        break
}

export {
    interfaceUrl
}
