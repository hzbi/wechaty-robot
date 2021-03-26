import { } from '../api'
import { delay, setSchedule } from '../utils'






/**
 * 设置定时任务
 * @param {*} that bot 对象
 * @param {*} item 定时任务项
 */
const setScheduleTask = (that, item) => {
    const time = item.isLoop ? item.time : new Date(item.time)
    lib.setSchedule(time, async () => {
        try {
            let contact = await that.Contact.find({ name: item.subscribe })
            console.log(`${item.subscribe}的专属提醒开启啦！`)
            await contact.say(item.content)
            if (!item.isLoop) {
                await api.updateSchedule(item._id)
            }
        } catch (error) {
            console.log('设置定时任务错误', error)
        }
    })
}

/**
 * 初始化小助手任务
 * @param {*} that bot对象
 * @param {*} scheduleList 提醒任务列表
 */
const initSchedule = (that, scheduleList) => {
    if (scheduleList && scheduleList.length > 0) {
        scheduleList.map(item => {
            setScheduleTask(that, item)
        })
    }
}

module.exports = {
    initSchedule
}