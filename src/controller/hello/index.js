import Logic from '@/logic/hello'

const logic = new Logic()

class Controller {

    /**
     * 获取列表
     */
    static async getList (ctx) {
        const data = await logic.getList(ctx)

        ctx.body = data
    }
}

export default Controller
