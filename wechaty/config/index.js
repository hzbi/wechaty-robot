// 本文件是配置案例文件，请拷贝一份此文件后重命名为config.js，否则项目无法运行
const new_friend_reply =
    `
你好，有什么可以帮助的？

一、加入明日之后营地群聊，回复[营地名称]
`

export default {
    token: 'puppet_donut_e348ab14a223b14b',
    name: '呵', // 用户自己设置的昵称叫做name
    auto_reply: true, // 是否设置机器人自动回复，默认关闭 false  开启为 true
    /**
     * 每日说定时任务（支持多人）
     * name:要发送好友的昵称 （注：不是微信号！不是微信号！不是微信号！）
     * alias:要发送好友的备注（默认查找备注优先，防止昵称带表情特殊字符）
     * memorialDay:你与朋友的纪念日
     * city:朋友所在城市，写的时候不要带‘市’
     * endWord:每日说内容的最后的落款 案例中效果为‘——————————爱你的朋友Leo_chen’
     * date:每天定时的发送时间，案例中代表每天早上8点钟，具体规则见‘wechaty/lib/index.js’ (多个好友不要设置相同时间！不要设置相同时间！不要设置相同时间！)
     */
    day_list: [
        { name: '昵称', alias: '备注', memorialDay: '2015/04/18', city: '上海', endWord: '爱你的朋友Leo_chen', date: '0 0 8 * * *' },
    ],
    /**
     * 群定时任务列表（支持多群配置）
     * roomName: 群名
     * sortId: 新闻资讯类别id （详情参见README.md数据字典）
     * endword: 结尾备注 ‘————————小助手雷欧’
     * date:每天定时的发送时间，案例中代表每天早上7点30分，具体规则见‘wechaty/lib/index.js’(多个群不要设置相同时间！不要设置相同时间！不要设置相同时间！)
     */
    room_list: [
        { roomName: '暴富', date: '0 30 20 * * 4', text: '9点特殊感染者，大家抓紧时间上线！', endWord: '--茶语' },
        { roomName: '暴富', date: '0 30 20 * * 6', text: '9点特殊感染者，大家抓紧时间上线！', endWord: '--茶语' }
        // { roomName: '暴富', date: '20 * * * * *' },
    ],
    /**
     * 自动添加好友关键词，留空代表同意任何好友请求 
     */
    accept_friend: [],
    /**
     * 好友进群通知，可配置多个
     */
    room_join_list: [
        { name: '茶语', welcome: `进群先把“群昵称”改成“游戏名”！！！` },
        { name: '暴富', welcome: '有什么问题都可以群里提出，大家都是很热情的' }
    ],
    /**
     * 关键词回复列表
     * key: 多个关键词触发相同内容，非模糊匹配，为全匹配
     * reply: 回复内容
     */
    key_word_list: [{ key: ['你好', '您好'], reply: '你好啊，我是小助手' }],
    /**
     * 新通过好友，默认发送消息
     */
    new_friend_reply: new_friend_reply,
    /**
     * 关键词加群配置
     * key: 多个关键词触发相加群操作，全匹配
     * roomName: 发送邀请的群名
     */
    add_room_key_list: [
        { key: ['茶语'], roomName: '茶语' },
        { key: ['暴富'], roomName: '暴富' }
    ],
    /**
     * 关键词触发指定事件，适用于私聊与群聊
     * key: 关键词
     * position: 关键词所在位置 start 开头  middle 不限 end 结尾
     * event: 触发事件名称，更多查看事件字典
     */
    event_key_word_list: [
        { key: '?', position: 'start', event: 'rubbish' },
        { key: '？', position: 'start', event: 'rubbish' },
        { key: '是什么垃圾', position: 'end', event: 'rubbish' },
        { key: '名人名言', position: 'middle', event: 'mingyan' },
        { key: '*', position: 'start', event: 'star' },
        { key: '姓', position: 'start', event: 'xing' },
        { key: '姓', position: 'end', event: 'xing' },
    ],
    delete_friend: '开启了朋友验证',
    new_add_friend: '你已添加',
    remind_key: '提醒',
    wx_official: ['朋友推荐消息', '微信支付', '微信运动', '微信团队']
}