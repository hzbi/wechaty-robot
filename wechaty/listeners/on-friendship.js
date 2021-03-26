import { Friendship } from 'wechaty'

import config from '../config/index'
import { delay } from '../utils/index'

async function onFriendship (friendship) {
    const name = friendship.contact().name()
    const hello = friendship.hello()
    const message = name + '，发送了好友请求'
    const contact = await this.Contact.find({ name: config.name })
    console.log(message)
    try {
        switch (friendship.type()) {
            case Friendship.Type.Receive:
                if (config.accept_friend.length == 0) {
                    console.log('无认证关键词,10秒后将会自动通过好友请求')
                    await delay(10000)
                    await friendship.accept()
                } else if (config.accept_friend.length > 0 && config.accept_friend.includes(hello)) {
                    console.log(`触发关键词${hello},10秒后自动通过好友请求`)
                    await delay(10000)
                    await friendship.accept()
                }
                break
            case Friendship.Type.Confirm:
                const message = '已确认添加好友：' + name
                contact.say(message)
                await delay(3000)
                const friend = await this.Contact.find({ name: name })
                friend.say(config.new_friend_reply)
                break
        }
    } catch (error) {
        console.log('添加好友出错：', error)
    }
}

export default onFriendship