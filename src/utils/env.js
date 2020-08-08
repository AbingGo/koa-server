const getEnv = () => {

    let env = process.env.ENV || 'prod'

    if (process.platform === 'linux') {
        env = 'prod'
    }

    return env
}

export default {
    getEnv
}
