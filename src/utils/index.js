import fs from 'fs'
import { isNum } from '@tencent/txv-utils'

/**
 * 时间转时间戳
 */
export const getDateTime = (str) => {
    let d = 0
    if (isNum(str)) {
        d = Number(str)
    } else {
        d = new Date(str).getTime() / 1000
    }

    return d
}

export const getDateNow = () => {
    return parseInt(Date.now() / 1000)
}

export const mkDirs = (dirname) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(dirname, { recursive: true }, (err) => {
            if (err) {
                reject(err)
            }
            resolve()
        })
    })
}

export const rowDataPacket = (list) => {
    if (list.length) {
        return list[0]
    }

    return {}
}

/**
 * 获取参数校验的配置
 * @param {*} curParams
 * @param {*} validConf
 */
export const getValidOptions = (curParams, validConf) => {

    const keys = Object.keys(curParams)
    let newObj = {}
    let validObj = {}

    keys.forEach(key => {

        if (curParams[key] && validConf[key]) {
            newObj[key] = curParams[key]
            validObj[key] = validConf[key]
        }
    })

    return {
        cur: newObj,
        valid: validObj
    }
}
