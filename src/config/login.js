import ENV from '@/utils/env'

const env = ENV.getEnv()

const conf = {
    dev: 180000000000,
    prod: 180
}

export default {
    timestamp: conf[env]
}
