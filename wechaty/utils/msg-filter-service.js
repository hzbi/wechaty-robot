import config from '../config/index'
import { getToday, convertTime } from '../utils/index'
/**
 * 设置提醒内容解析
 * @param {*} contact 设置定时任务的用户
 * @param {*} keywordArray 分词后内容
 */

const contentDistinguish = (keywordArray, name) => {
    const data = {}
    const today = getToday('YYYY-MM-DD')
    data.setter = name // 设置定时任务的用户
    data.subscribe = keywordArray[1] == '我' ? name : keywordArray[1] // 定时任务接收者
    if (keywordArray[2] == '每天') {
        // 判断是否属于循环任务
        console.log('已设置每日定时任务')
        data.isLoop = true
        if (keywordArray[3].includes(':') || keywordArray[3].includes('：')) {
            const time = keywordArray[3].replace('：', ':')
            data.time = convertTime(time)
        } else {
            data.time = ''
        }
        data.content = (data.setter == data.subscribe) ?
            `亲爱的${data.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` :
            `亲爱的${data.subscribe}，${data.setter}委托我提醒你：${keywordArray[4].replace('我', '你')}`
    } else if (keywordArray[2] && keywordArray[2].includes('-')) {
        console.log('已设置指定日期时间任务')
        data.isLoop = false
        data.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':')
        data.content = (data.setter == data.subscribe) ?
            `亲爱的${data.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}` :
            `亲爱的${data.subscribe}，${data.setter}委托我提醒你：${keywordArray[4].replace('我', '你')}`
    } else {
        console.log('已设置当天任务')
        data.isLoop = false
        data.time = today + ' ' + keywordArray[2].replace('：', ':')
        data.content = (data.setter == data.subscribe) ?
            `亲爱的${data.subscribe}，温馨提醒：${keywordArray[3].replace('我', '你')}` :
            `亲爱的${data.subscribe}，${data.setter}委托我提醒你：${keywordArray[3].replace('我', '你')}`
    }
    return data
}

/**
 * 微信好友文本消息事件过滤
 * @param {string} msg 消息内容
 * @param {string} name 好友昵称
 * @param {string} id 用户id
 * @param {string} avatar 用户头像
 * @returns {number} 返回回复内容
 */
const filterFriendMsg = (msg, name, id, avatar) => {
    if (msg == '') {
        return { type: 'text', content: '我在', event: {} }
    }
    if (msg.includes(config.delete_friend) || config.wx_official.includes(name) || msg.length > 40) {
        console.log('字符超40字符，或无效及官方消息，不做回复')
        return { type: 'text', content: '', event: {} }
    }
    if (msg.includes(config.new_add_friend)) {
        console.log(`新添加好友：${name}，默认回复`)
        return { type: 'text', content: config.new_friend_reply, event: {} }
    }
    if (config.add_room_key_list && config.add_room_key_list.length > 0) {
        for (let item of config.add_room_key_list) {
            if (item.key.includes(msg)) {
                console.log(`匹配到加群关键词${msg},正在邀请用户进群`)
                return { type: 'addRoom', content: '', event: { name: item.roomName } }
            }
        }
    }
    if (config.key_word_list && config.key_word_list.length > 0) {
        for (let item of config.key_word_list) {
            if (item.key.includes(msg)) {
                console.log(`匹配到关键词${msg},正在回复用户`)
                return { type: 'text', content: item.reply, event: {} }
            }
        }
    }
    if (msg.startsWith(config.remind_key)) {
        const msgArr = msg.replace(/\s+/g, ' ').split(' ')
        if (msgArr.length > 3) {
            return { type: 'remind', content: contentDistinguish(msgArr, name), event: {} }
        } else {
            return { type: 'text', content: '提醒设置失败，请保证每个关键词之间使用空格分割开，并保证日期格式正确。正确格式为：“提醒(空格)我(空格)18:30(空格)下班回家”', event: {} }
        }
    }
    if (config.event_key_word_list && config.event_key_word_list.length > 0) {
        for (let item of config.event_key_word_list) {
            switch (item.position) {
                case 'start':
                    if (msg.startsWith(item.key)) {
                        msg = msg.replace(item.key, '')
                        return { type: 'event', content: '', event: {} }
                    }
                    break
                case 'middle':
                    if (msg.includes(item.key)) {
                        msg = msg.replace(item.key, '')
                        return { type: 'event', content: '', event: {} }
                    }
                    break
                case 'end':
                    if (msg.endsWith(item.key)) {
                        msg = msg.replace(item.key, '')
                        return { type: 'event', content: '', event: {} }
                    }
                    break
                default:
                    break
            }
        }
    }
    if (config.auto_reply) {
        console.log('开启了机器人自动回复功能')
        return { type: 'text', content: '', event: {} }
    } else {
        console.log('没有开启机器人自动回复功能')
        return { type: 'text', content: '', event: {} }
    }
}

/**
 * 微信群文本消息事件监听
 * @param {*} msg 群消息内容
 * @param {*} name 发消息人昵称
 * @param {*} id 发消息人
 * @returns {number} 返回事件类型
 * 事件说明
 * 0 机器人回复
 * 1 开启了好友验证 || 朋友推荐消息 || 发送的文字消息过长,大于40个字符
 * 2 初次添加好友
 */
const filterRoomMsg = (msg, name, id, avatar) => {
    if (msg == '') {
        return { type: 'text', content: '我在', event: {} }
    }
    if (config.key_word_list && config.key_word_list.length > 0) {
        for (let item of config.key_word_list) {
            if (item.key.includes(msg)) {
                console.log(`匹配到关键词${msg},正在回复用户`)
                return { type: 'text', content: item.reply, event: {} }
            }
        }
    }
    if (config.event_key_word_list && config.event_key_word_list.length > 0) {
        for (let item of config.event_key_word_list) {
            switch (item.position) {
                case 'start':
                    if (msg.startsWith(item.key)) {
                        msg = msg.replace(item.key, '')
                        return { type: 'event', content: '', event: {} }
                    }
                    break
                case 'middle':
                    if (msg.includes(item.key)) {
                        msg = msg.replace(item.key, '')
                        return { type: 'event', content: '', event: {} }
                    }
                    break
                case 'end':
                    if (msg.endsWith(item.key)) {
                        msg = msg.replace(item.key, '')
                        return { type: 'event', content: '', event: {} }
                    }
                    break
                default:
                    break
            }
        }
    }
    if (config.auto_reply) {
        console.log('开启了机器人自动回复功能')
        return { type: 'text', content: '', event: {} }
    } else {
        console.log('没有开启机器人自动回复功能')
        return { type: 'text', content: '', event: {} }
    }
}

export {
    filterFriendMsg,
    filterRoomMsg
}