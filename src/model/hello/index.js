import { DICTIONARY } from '@/config/mysql'
import Base from '../base.class'

/**
 * 条件表
 */
const TABLE = ''

/**
 * 当前表所包含的可操作字段
 */
const FILEDS = []

export default class PoolModel extends Base {
    constructor () {

        const db = {
            dbConf: DICTIONARY,
            table: TABLE,
            fileds: FILEDS
        }

        super(db)
        this.idKey = ''
        this.orderBy = ''
    }

    /**
     * 通过filter 获取公共sql
     * @param {*} filter
     */
    getBaseFilterSql (filter) {
        const sql = ''

        const values = []

        return {
            sql,
            values
        }
    }
}
