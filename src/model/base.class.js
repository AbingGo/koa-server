import { to } from '@tencent/txv-utils'
import mysql from '@/commons/mysql'

class BaseModel {
    constructor (opts) {
        const { dbConf, fileds = [], table = '' } = opts

        this.fileds = fileds
        this.table = table
        this.pool = mysql.getPool(dbConf)
    }

    /**
     * 执行sql
     * @param {*} sql
     * @param {*} values
     */
    query (sql, values) {
        return mysql.query(this.pool, sql, values)
    }

    getCommonSql (data) {
        return mysql.getCommonSql(data, this.fileds)
    }

    /**
     * 通过id来查询数据
     * @param {*} id
     * @param {*} _sql 自定义的sql，方便扩展增加额外条件
     */
    async findDataById (id, _sql) {
        let sql = `
            SELECT *
            FROM
                ${this.table}
            WHERE
                ${this.idKey} = ?
        `

        sql = _sql ? `${sql} AND ${_sql}` : sql

        const res = await to(this.query(sql, [id]))

        return res
    }

    /**
     * 新增数据
     * @param {*} data
     */
    async add (data) {
        let { sql, values } = this.getCommonSql(data)

        sql = `
            INSERT INTO
                ${this.table}
            SET
            ${sql}
        `

        const [err] = await to(this.query(sql, values))

        return [err, data]
    }

    /**
     * 通过id来更新数据
     * @param {*} id
     * @param {*} data
     * @param {*} _sql 自定义的sql，方便扩展
     */
    async updateById (id, data, _sql) {
        let { sql, values } = this.getCommonSql(data)

        sql = `
            UPDATE
                ${this.table}
            SET
                ${sql}
            WHERE
                ${this.idKey} = ?
        `

        sql = _sql ? `${sql} AND ${_sql}` : sql
        values = [...values, id]

        const [err] = await to(this.query(sql, values))

        return [err, data]
    }

    /**
     * 分页查询
     * @param {*} 筛选条件
     */
    getFilterSql (filter) {
        const { sql, values } = this.getBaseFilterSql(filter)
        const filterSql = `
            SELECT *
            FROM
                ${this.table}
            WHERE
                ${sql}
            ORDER BY
                ${this.orderBy} DESC
            LIMIT
                ?, ?
        `

        return {
            sql: filterSql,
            values
        }
    }

    /**
     * 查询符合条件的总数据
     * @param {*} filter 筛选条件
     */
    getTotalSql (filter) {
        const { sql, values } = this.getBaseFilterSql(filter)
        const totalSql = `
            SELECT COUNT(id) 
            AS
                total
            FROM
                ${this.table} 
            WHERE
                ${sql}
        `

        return {
            sql: totalSql,
            values
        }
    }

    /**
     * 获取当前满足条件的总数
     * @param {*} filter 筛选条件
     */
    async getTotal (filter) {
        const { sql, values } = this.getTotalSql(filter)
        const res = await to(this.query(sql, values))

        return res
    }

    /**
     * 查询，搜索，过滤数据
     * @param {*} filter 筛选条件
     * @param {*} skip 分页信息
     */
    async getList (filter, skip) {
        const { page, pagesize } = skip
        const { sql, values } = this.getFilterSql(filter)
        const num = page * pagesize
        const res = await to(this.query(sql, [...values, num, pagesize]))

        return res
    }
}

export default BaseModel
