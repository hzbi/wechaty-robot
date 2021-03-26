const schedule = require('node-schedule')
const moment = require('moment')
moment.locale('zh-cn')

/**
 * 延时函数
 * @param {*} ms 毫秒
 */
const delay = (ms) => {
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
const setSchedule = (date, callback) => {
    schedule.scheduleJob(date, callback)
}

const getToday = (type = 'YYYY-MM-DD HH:mm:ss') => {
    const date = new Date()
    return moment(date).format(type)
}

const convertTime = (time) => {
    const array = time.split(':')
    return '0 ' + array[1] + ' ' + array[0] + ' * * *'
}

const contentDistinguish = (content, keywordArray) => {
    const scheduleObj = {}
    const today = getToday()
    scheduleObj.setter = content.name() // 设置定时任务的用户
    scheduleObj.subscribe = (keywordArray[1] == "我") ? contact.name() : keywordArray[1] // 定时任务接收者
    if (keywordArray[2] === "每天") { // 判断是否属于循环任务
        console.log('已设置每日定时任务')
        scheduleObj.isLoop = true
        scheduleObj.time = convertTime(keywordArray[3])
        scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = "亲爱的" + scheduleObj.subscribe + "，温馨提醒：" + keywordArray[4].replace('我', '你') : "亲爱的" + scheduleObj.subscribe + "，" + scheduleObj.setter + "委托我提醒你，" + keywordArray[4].replace('我', '你')
    } else if (keywordArray[2] && keywordArray[2].indexOf('-') > -1) {
        console.log('已设置指定日期时间任务')
        scheduleObj.isLoop = false
        scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':')
        scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = "亲爱的" + scheduleObj.subscribe + "，温馨提醒：" + keywordArray[4].replace('我', '你') : "亲爱的" + scheduleObj.subscribe + "，" + scheduleObj.setter + "委托我提醒你，" + keywordArray[4].replace('我', '你')
    } else {
        console.log('已设置当天任务')
        scheduleObj.isLoop = false
        scheduleObj.time = today + keywordArray[2].replace('：', ':')
        scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = "亲爱的" + scheduleObj.subscribe + "，温馨提醒：" + keywordArray[3].replace('我', '你') : "亲爱的" + scheduleObj.subscribe + "，" + scheduleObj.setter + "委托我提醒你，" + keywordArray[3].replace('我', '你')
    }
    return scheduleObj
}

module.exports = {
    delay,
    setSchedule,
    getToday
}