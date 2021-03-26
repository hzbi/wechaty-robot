import Assistant from '../../schema/assistant/index'

export default {
    insert: (conditions) => {
        return new Promise((resolve, reject) => {
            Assistant.create(conditions, (err, message) => {
                if (err) return reject(err)
                return resolve(message)
            })
        })
    },
    find: (conditions) => {
        return new Promise((resolve, reject) => {
            Assistant.find(conditions, (err, message) => {
                if (err) return reject(err)
                return resolve(message)
            })
        })
    },
    update: (conditions) => {
        return new Promise((resolve, reject) => {
            Assistant.updateOne(conditions, { hasExpired: true }, (err, message) => {
                if (err) return reject(err)
                return resolve(message)
            })
        })
    }
}