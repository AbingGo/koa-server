import 'module-alias/register'
import '@babel/polyfill'
import cluster from 'cluster'
import log from '@/logger/log'

const clusterLog = log.getLogger('clusterLog')

// 进程数
const CLUSTERS = process.env.CLUSTERS || 2

if (cluster.isMaster) {
    for (let i = 0; i < CLUSTERS; i++) {
        cluster.fork()
    }

    cluster.on('online', (worker) => {
        clusterLog.info(`Worker ${worker.process.pid} is online`)
    })

    cluster.on('exit', (worker, code, signal) => {
        clusterLog.error(`Worker ${worker.process.pid}  died with code: ${code}, and signal: ${signal}`)
        clusterLog.info('Starting a new worker')
        cluster.fork()
    })
} else {
    require('./app.js')
}
