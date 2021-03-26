import mongoose from '../../db/config'

const assistantSchema = mongoose.Schema({
    subscribe: String, // 订阅者
    setter: String, // 设定任务者
    content: String, // 订阅内容
    time: String, // 定时日期
    isLoop: Boolean, // 是否为循环定时任务
    hasExpired: { type: Boolean, default: false } // 判断任务是否过期
}, {
    _id: true,
    timestamps: {
        createdAt: 'createTime',
        updatedAt: 'updateTime'
    }
})
const Assistant = mongoose.model('assistant', assistantSchema)

export default Assistant