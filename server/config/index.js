import development_env from './development'
import production_env from './production'

export default {
    development: development_env,
    production: production_env
}[process.env.NODE_ENV || 'development']