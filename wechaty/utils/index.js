import schedule from 'node-schedule'
import moment from 'moment'
moment.locale('zh-cn')

/**
 * 延时函数
 * @param {*} ms 毫秒
 */
export const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 设置定时器
 * @param {*} date 日期
 * @param {*} callback 回调
 */
//其他规则见 https://www.npmjs.com/package/node-schedule
// 规则参数讲解    *代表通配符
//
// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │  |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

// 每分钟的第30秒触发： '30 * * * * *'
//
// 每小时的1分30秒触发 ：'30 1 * * * *'
//
// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
//
// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
//
// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'
export const setSchedule = (date, callback) => {
    schedule.scheduleJob(date, callback)
}

export const getToday = (type = 'YYYY-MM-DD HH:mm:ss') => {
    const date = new Date()
    return moment(date).format(type)
}

export const convertTime = (time) => {
    const array = time.split(':')
    return '0 ' + array[1] + ' ' + array[0] + ' * * *'
}

export const isRealDate = (str) => {
    var reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/
    var r = str.match(reg)
    if (r == null) return false
    r[2] = r[2] - 1
    var d = new Date(r[1], r[2], r[3], r[4], r[5])
    if (d.getFullYear() != r[1]) return false
    if (d.getMonth() != r[2]) return false
    if (d.getDate() != r[3]) return false
    if (d.getHours() != r[4]) return false
    if (d.getMinutes() != r[5]) return false
    return true
}
