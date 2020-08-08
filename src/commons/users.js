import { to } from '@tencent/txv-utils'
import l5 from '@/commons/l5'
import redisLib from '@/commons/redis'

/**
 * 无极拉取配置，写入redis
 */
const writeUserRedis = async (redis) => {
    const options = {
        params: {},
        headers: {}
    }

    const [err, responseStr] = await to(l5.httpGet(options))

    if (err || !responseStr) {
        return
    }

    await redis.set('prefix_users_list', responseStr)

    return [err, responseStr]
}

/**
 * 获取当前权限列表
 */
const getUsersList = async (level = 0) => {
    let usersList = [
        {
            username: 'janbinwang',
            level: 3,
            remark: '超级管理员'
        },
        {
            username: 'bbbbbb',
            level: 0,
            remark: '普通用户'
        }
    ]
    const redis = await redisLib.getRedis()
    const [err, usersData] = await to(redis.get('prefix_users_list'))

    if (err || !usersData) {
        return usersList
    }

    try {
        usersList = JSON.parse(usersData).data || usersList
    } catch (error) {}

    const curUserList = usersList.filter(item => item.level >= level)

    return curUserList
}

/**
 * 获取用户等级
 */
const getLevel = async (ctx) => {
    const usersList = await getUsersList()
    const username = ctx.request.header['staffname']
    const userData = usersList.find(item => item.username === username)

    if (!userData) {
        return -1
    }

    const { level } = userData

    return level
}

/**
 * 普通权限
 */
const isUser = async (ctx) => {
    const level = await getLevel(ctx)

    return level >= 0
}

/**
 * 只读权限
 */
const isOnlyRead = async (ctx) => {
    const level = await getLevel(ctx)

    return level === 1
}

/**
 * 管理员
 */
const isAdmin = async (ctx) => {
    const level = await getLevel(ctx)

    return level >= 2
}

/**
 * 超级管理员
 */
const isSuperAdmin = async (ctx) => {
    const level = await getLevel(ctx)

    return level > 2
}

export default {
    writeUserRedis,
    getUsersList,
    isUser,
    isAdmin,
    isSuperAdmin,
    isOnlyRead
}
