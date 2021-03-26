import { Wechaty } from 'wechaty'

import onScan from './listeners/on-scan'
import onLogin from './listeners/on-login'
import onFriendship from './listeners/on-friendship'
import onRoomJoin from './listeners/on-room-join'
import onMessage from './listeners/on-message'

import config from './config'

const robot = new Wechaty({
    name: 'hzbi',
    puppet: 'wechaty-puppet-hostie',
    puppetOptions: {
        token: config.token,
    }
})

robot.on('scan', onScan)

robot.on('login', onLogin)

robot.on('friendship', onFriendship)

robot.on('room-join', onRoomJoin)

robot.on('message', onMessage)

robot.start()
    .catch(e => console.error(e))
