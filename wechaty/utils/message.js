import { createSchedule, updateSchedule } from '../api/index'
import { filterFriendMsg, filterRoomMsg } from './msg-filter-service'
import { delay, isRealDate, setSchedule } from '../utils/index'

const addSchedule = async (that, obj) => {
    try {
        const data = await createSchedule(obj)
        const rule = data.isLoop ? data.time : new Date(data.time)
        const contact = await that.Contact.find({ name: data.subscribe })
        setSchedule(rule, async () => {
            console.log('你的专属提醒开启啦！')
            await delay(1000)
            await contact.say(data.content)
            if (!data.isLoop) {
                updateSchedule(data._id)
            }
        })
        return true
    } catch (error) {
        console.log('设置定时任务失败', error)
        return false
    }
}

/**
 * 获取私聊返回内容
 */
const getContactTextReply = async (that, contact, msg) => {
    const contactName = contact.name()
    const contactId = contact.id
    const contactAvatar = await contact.avatar()
    const result = await filterFriendMsg(msg, contactName, contactId, contactAvatar)
    if (result.type == 'text') {
        return result.content
    } else if (result.type == 'addRoom') {
        const room = await that.Room.find({ topic: result.event.name })
        if (room) {
            try {
                await delay(1000)
                contact.say('小助手正在处理你的入群申请，请不要重复回复...')
                await delay(10000)
                await room.add(contact)
            } catch (error) {
                console.error('加群报错', error)
            }
        } else {
            console.log(`不存在此群：${result.event.name}`)
        }
        return ''
    } else if (result.type == 'remind') {
        try {
            const data = result.content
            if (data.isLoop) {
                if (data.time) {
                    const result = await addSchedule(that, data)
                    if (result) {
                        await delay(1000)
                        contact.say('小助手已经把你的提醒牢记在小本本上了')
                    } else {
                        await delay(1000)
                        contact.say('添加提醒失败，请稍后重试')
                    }
                } else {
                    contact.say('提醒设置失败，日期格式不正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家” 或“提醒(空格)我(空格)2019-10-01 8:30(空格)还有两天就是老婆生日，要准备一下了”')
                }
            } else {
                const isTime = isRealDate(data.time)
                if (isTime) {
                    await addSchedule(that, data)
                    await delay(1000)
                    contact.say('小助手已经把你的提醒牢记在小本本上了')
                } else {
                    await delay(1000)
                    contact.say('提醒设置失败，日期格式不正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家” 或“提醒(空格)我(空格)2019-10-01 8:30(空格)还有两天就是老婆生日，要准备一下了”')
                }
            }
            return ''
        } catch (error) {
            console.log(`定时任务出错，${error}`)
        }
    }
}

/**
 * 获取群消息回复
 * @param {*} content 群消息内容
 * @param {*} name 发消息者昵称
 * @param {*} id 发消息者id
 */
const getRoomTextReply = async (content, name, id, avatar) => {
    const result = await filterRoomMsg(content, name, id, avatar)
    if (result.type == 'text') {
        return result.content
    }
}

const getEveryDayRoomContent = async (item) => {
    const content = `${item.text}<br>${item.endWord}`
    return content
}

export {
    getContactTextReply,
    getRoomTextReply,
    getEveryDayRoomContent
}