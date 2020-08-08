/**
 * 业务逻辑错误
 * 缺少参数，数据不存在等 [10000-19999]
 * 未登录，没有权限等[20000-29999]
 */
const CODES = {
    empty: {
        errno: 10000,
        message: '数据不存在，请检查id是否正确'
    }
}

export default CODES
