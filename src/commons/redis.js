import Redis from 'ioredis'
import { sleep } from '@tencent/txv-utils'
import conf from '@/config/redis'
import log from '@/logger/log'

const redisLog = log.getLogger('redisLog')

let redisInstance

const createRedis = () => {
    const redisConf = conf.getRedis()
    const redis = new Redis({
        port: redisConf.port,
        host: redisConf.ip,
        prefix: 'prefix_',
        enableReadyCheck: false
    })

    redis.on('connect', () => {
        console.log('redis connect success!', redisConf)
        redisLog.info(`Redis new conf: \n ${JSON.stringify(redisConf)}`)
    })

    redis.on('error', (err) => {
        console.log('redis connect error!', err)
        redisLog.error(`redis connect error! ${err}`)
    })

    redis.on('reconnecting', () => {

        // 断线重连时，获取新的ip，port
        const redisConf = conf.getRedis()
        redis.options.host = redisConf.ip
        redis.options.port = redisConf.port
        console.log('redis reconnecting.', redisConf)
    })

    return redis
}

const getRedis = () => {
    if (!redisInstance) {
        redisInstance = createRedis()
    }

    return redisInstance
}

/**
 * redis 加锁
 * fn 自定义方法
 * redisCount redis的key
 * sleepTime等待多久之后释放redis锁
 */
const lock = (fn, redisCount, sleepTime = 0) => {

    return async function (...args) {
        const redis = await getRedis()

        // 获取是否有crontab锁，抢占资源
        const crontabCount = await redis.incr(redisCount)

        // 判断是否抢占到了资源
        if (crontabCount === 1) {

            // 执行业务逻辑
            await fn(args)

            // 等待 sleepTime 时间后释放锁
            await sleep(sleepTime)
        }

        // 重置计数器
        await redis.decr(redisCount)
    }
}

export default {
    createRedis,
    getRedis,
    lock
}
