import mysql from 'mysql'
import { isUndefined } from '@tencent/txv-utils'
import ENV from '@/utils/env'

const env = ENV.getEnv()
const poolInstance = {}

/**
 * 获取dev | prod环境配置，prod通过名字服务获取ip,port
 */
const getDbConf = (conf) => {

    if (env !== 'dev') {
        const ipPort = {}

        return {
            ...ipPort,
            ...conf.prod
        }
    }

    return conf.dev
}

/**
 * 获取连接池实例，通过db来区分
 */
const getPool = (dbConf) => {
    const conf = getDbConf(dbConf)
    const { database } = conf

    if (poolInstance[database]) {
        return poolInstance[database]
    }

    poolInstance[database] = mysql.createPool({
        host: conf.ip,
        port: conf.port,
        user: conf.user,
        password: conf.password,
        database: conf.database,
        dateStrings: conf.dateStrings,
        timeout: conf.timeout || 800
    })

    return poolInstance[database]
}

/**
 * mysql操作封装
 */
const query = (pool, sql, values) => {
    sql = sql.replace(/\n/g, ' ')

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)

                return
            }

            connection.query({ sql, values, timeout: 1000 }, (err, rows) => {
                connection.release()
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    })
}

/**
 * sql values拼接
 * @param {*} data
 */
const getCommonSql = (data = {}, fileds = []) => {

    // 筛选出表中有的字段
    const keys = Object.keys(data).filter(key => fileds.includes(key))

    // 将符合条件的数据，放到 values
    const values = keys.map(key => isUndefined(data[key]) ? '' : data[key])

    // 拼接成sql语句
    const sql = keys.reduce((sql, key) => `${sql}${key}=?,`, '')

    return {
        sql: sql.substr(0, sql.length - 1),
        values
    }
}

export default {
    getDbConf,
    getPool,
    query,
    getCommonSql
}
