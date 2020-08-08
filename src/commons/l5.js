import http from 'http'
import { encodeURIJson } from '@tencent/txv-utils'
import ENV from '@/utils/env'

const env = ENV.getEnv()

/**
 * 获取ip, port
 */
const getIpPort = function (conf) {
    return new Promise(function (resolve, reject) {
        if (env === 'dev') {
            resolve({
                ip: '127.0.0.1',
                port: 8080
            })

            return
        }

        // 获取生产环境ip, port
        return {
            ip: 'xxxx',
            port: 8080
        }
    })
}

/**
 * 请求数据
 * @param {*} options
 */
const httpGet = async (options) => {
    options = {
        timeout: 0.2,
        debug: false,
        domain: 'custom.com',
        path: '',
        params: {},
        headers: {
            'HOST': 'custom.com'
        },
        ...options
    }

    const { ip, port } = await getIpPort({
        modid: options.modid,
        cmd: options.cmd,
        timeout: options.timeout,
        debug: options.debug
    })

    let path = `${options.path}?${encodeURIJson(options.params)}`
    if (options.path.indexOf('?') >= 0) {
        path = `${options.path}${encodeURIJson(options.params)}`
    }
    const reqConf = {
        host: ip,
        port,
        path,
        headers: options.headers
    }

    return new Promise((resolve, reject) => {
        http
            .get(reqConf, (res) => {
                let fileStr = ''

                res.on('data', (data) => {
                    fileStr += data
                })

                res.on('end', (data) => {
                    resolve(fileStr)
                })
            })

            .on('error', (err) => {
                reject(err)
            })
    })
}

export default {
    getIpPort,
    httpGet
}
