import { getScheduleList, updateSchedule } from '../api/index'
import { getEveryDayRoomContent } from '../utils/message'
import { delay, setSchedule } from '../utils/index'
import config from '../config/index'

async function setScheduleTask (that, item) {
    const time = item.isLoop ? item.time : new Date(item.time)
    setSchedule(time, async () => {
        try {
            const contact = await that.Contact.find({ name: config.name })
            console.log(`${item.subscribe}的专属提醒开启啦！`)
            await contact.say(item.content)
            if (!item.isLoop) {
                await updateSchedule(item._id)
            }
        } catch (error) {
            console.log('设置定时任务错误', error)
        }
    })
}

async function setEveryDayRoomTask (that, item) {
    try {
        const time = item.date
        const room = await that.Room.find({ topic: item.roomName })
        if (!room) {
            console.log(`查找不到群：${item.roomName}，请检查群名是否正确`)
            return
        } else {
            console.log(`群：“${item.roomName}”设置定时任务成功`)
            setSchedule(time, async () => {
                const content = await getEveryDayRoomContent(room, item)
                const mentionList = await room.memberAll()
                console.log('定时任务开始发送，内容：', content)
                await delay(1000)
                await room.say(content, ...mentionList)
            })
        }
    } catch (error) {
        console.log('设置群定时任务失败：', error)
    }
}

const initSchedule = (that, scheduleList, roomSayList) => {
    if (scheduleList && scheduleList.length > 0) {
        scheduleList.map(item => {
            setScheduleTask(that, item)
        })
    }
    if (roomSayList && roomSayList.length > 0) {
        roomSayList.map(item => {
            setEveryDayRoomTask(that, item)
        })
    }
}

async function onLogin (user) {
    console.log(`${user} 登录了`)
    await delay(3000)
    const scheduleList = await getScheduleList()
    // console.log('提醒任务列表', scheduleList)
    initSchedule(this, scheduleList, config.room_list)
}

export default onLogin