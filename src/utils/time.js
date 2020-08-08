import { isNum } from '@tencent/txv-utils'

/**
 * 时间转时间戳
 */
export const getDateTime = (str) => {
    let d = 0
    if (isNum(str)) {
        d = Number(str)
    } else {
        d = new Date(str).getTime()
    }

    return d
}

export const getDateNow = () => {
    return Date.now()
}
