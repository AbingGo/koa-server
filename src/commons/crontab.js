import schedule from 'node-schedule'
import log from '@/logger/log'
import users from '@/commons/users'
import redisLib from '@/commons/redis'

const crontabLog = log.getLogger('crontabLog')

const undateUserList = async () => {

    const update = async () => {

        crontabLog.info(`crontab 5 minute run: ${new Date()}`)

        const redis = await redisLib.getRedis()

        // 更新用户权限表
        await users.writeUserRedis(redis)
    }

    redisLib.lock(update, 'updateUserList')()
}

/**
 * 定时任务启动
 */
const run = () => {

    // 每2分钟定时执行一次 */2 * * * *
    schedule.scheduleJob('*/2 * * * *', undateUserList)
}

export default {
    run
}
