import ENV from '@/utils/env'

const env = ENV.getEnv()

/**
 * 获取redis相关配置
 */
const getRedis = () => {
    if (env !== 'dev') {

        // 线上，通过名字服务等先获取ip port
    }

    return {
        port: 6379,
        ip: '127.0.0.1'
    }
}

export default {
    getRedis
}
