import Model from '@/model/hello'
import VALIDATION from '@/config/validation'
import Base from '../base.class'

const model = new Model()

export default class Logic extends Base {

    constructor () {
        const ops = {
            model,

            // 校验字段，统一在 validation 文件管理
            validation: VALIDATION.HELLO
        }

        super(ops)
    }

    async getList (ctx) {

        return [1, 2, 3]
    }
}
