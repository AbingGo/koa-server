import paramChecker from 'js-param-checker'
import { to, isString } from '@tencent/txv-utils'
import { rowDataPacket, getValidOptions } from '@/utils'
import redisLib from '@/commons/redis'
import users from '@/commons/users'
import log from '@/logger/log'
import CODES from '@/config/codes'

const errorLog = log.getLogger('errorLog')

class Service {
    constructor (opts) {
        const { model = {}, validation = { save: {} } } = opts

        this.model = model
        this.validation = validation
        this.errorLog = log.getLogger('errorLog')
    }

    /**
     * 通过id查找
     */
    async findDataById (id, sql) {

        if (!id) {
            return CODES.empty
        }

        const [err, data] = await this.model.findDataById(id, sql)

        if (err || !data.length) {
            return CODES.empty
        }

        let formateData = {}
        try {
            formateData = rowDataPacket(JSON.parse(JSON.stringify(data)))
        } catch (error) {
            errorLog.error(`获取数据失败 catch ：${error}, id: ${id}, data: ${JSON.stringify(data)}`)
        }

        delete formateData.id
        delete formateData.is_delete

        return formateData
    }

    /**
     * 列表搜索通用参数，可在子类中覆盖
     */
    async getQueryParams (ctx) {
        const { query } = ctx.request
        const user = ctx.request.header['staffname']
        const isAdmin = await users.isAdmin(ctx)

        if (!isAdmin) {
            query.operator = user
        }

        return query
    }

    /**
     * 获取列表，可在子类中覆盖
     */
    async getList (ctx) {
        const res = await this.queryList(ctx)

        res.list = res.list.map(item => {

            delete item.id
            delete item.is_delete

            return item
        })

        return res
    }

    /**
     * 分页获取列表通用方法
     */
    async queryList (ctx) {
        const { page = 0, pagesize = 10 } = ctx.request.query
        const query = await this.getQueryParams(ctx)

        // 分页
        const skip = {
            page: Number(page),
            pagesize: Number(pagesize)
        }

        // 查询总数
        const [totalErr, total] = await this.model.getTotal(query)

        if (totalErr) {
            return {
                list: [],
                total: 0,
                message: totalErr.message
            }
        }

        // 查询数据
        let [resErr, list] = await this.model.getList(query, skip)
        if (resErr) {
            return {
                list: [],
                total: 0,
                message: resErr.message
            }
        }

        return {
            list,
            total: total[0].total
        }
    }

    /**
     * 保存数据通用方法，有id 更新，无id新增
     */
    async saveData (ctx, params, sql) {

        // 参数合法性校验
        const options = getValidOptions(params, this.validation.save)
        const paramsErr = paramChecker.check(options.cur, options.valid)

        if (paramsErr) {
            return {
                ...CODES.save,
                message: paramsErr.msg
            }
        }

        const { idKey } = this.model
        let res = []

        const findData = await this.findDataById(params[idKey], sql)

        // 查询当前数据是否存在
        if (findData[idKey]) {
            res = await this.update(ctx, params)
        } else {
            res = await this.add(ctx, params)
        }

        if (!Array.isArray(res)) {
            return res
        }

        const [err, data] = res

        if (err) {
            return {
                ...CODES.save,
                message: err.message
            }
        }

        return data
    }

    async delRedis (params) {
        const keys = isString(params) ? [params] : params
        const redis = await redisLib.getRedis()

        for (const key of keys) {
            const res = await to(redis.del(key))
            const [err] = res

            if (err) {
                return res
            }
        }

        return [null]
    }
}

export default Service
