import request from './superagent'
import { interfaceUrl } from './config'

export const getScheduleList = async () => {
    try {
        const result = await request({ method: 'GET', url: interfaceUrl + 'assistant/api/schedule-list', params: '' })
        return JSON.parse(result.text).data
    } catch (error) {
        console.log('获取定时任务失败:' + error)
    }
}

export const createSchedule = async (params) => {
    try {
        const result = await request({ method: 'POST', url: interfaceUrl + 'assistant/api/create-schedule', params: params })
        return JSON.parse(result.text).data
    } catch (error) {
        console.log('添加定时任务失败', error)
    }
}

export const updateSchedule = async (id) => {
    try {
        await request({ method: 'POST', url: interfaceUrl + 'assistant/api/update-schedule', params: { id: id } })
        console.log('更新定时任务成功')
    } catch (error) {
        console.log('更新定时任务失败', error)
    }
}