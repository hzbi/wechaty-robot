import mongoose from 'mongoose'

import config from '../config/index'

mongoose.connect(
    config.mongodb_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
)

const db = mongoose.connection

db.once('error', () => console.log('MongoDB connect fail'))
db.once('connected', () => console.log(`MongoDB ${config.mongodb_url} connect success`))
db.once('disconnected', () => console.log('MongoDB connect disconnected'))

export default mongoose