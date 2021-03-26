import { FileBox } from 'file-box'
import path from 'path'

import config from '../config'


/**
 * 判断配置中是否存在此群
 * @param {*} list 配置的群组
 * @param {*} name 有新人的群名
 * @return {*} 配置中此群的下标，不存在此群返回-1
 */
const roomHasConfig = (list, name) => {
    if (list.length == 0) return -1
    for (let i in list) {
        if (list[i].name == name) return i
    }
    return -1
}

/**
 * 群中有新人进入
 */
const welcome = (name, roomIndex, roomName) => {
    return `
欢迎新朋友 @${name}

${config.room_join_list[roomIndex].welcome}

--${roomName}
`
}

const onRoomJoin = async (room, inviteeList, inviter) => {
    const nameList = inviteeList.map(item => item.name()).join(',')
    const roomName = await room.topic()
    const roomIndex = roomHasConfig(config.room_join_list, roomName)
    if (roomIndex > -1) {
        console.log(`群名：${roomName}，加入新成员：${nameList}，邀请人：${inviter}`)
        room.say(welcome(nameList, roomIndex, roomName))
        if (config.room_join_list[roomIndex].file) {
            const fileBox = FileBox.fromFile(path.resolve(__dirname, config.room_join_list[roomIndex].file.path))
            await room.say(fileBox)
        }
    }
}

export default onRoomJoin