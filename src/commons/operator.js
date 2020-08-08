const set = (operator) => {
    const operatorArr = operator.split(';')
    operator = operatorArr.reduce((prev, next) => {
        return `${prev}${next};`
    }, ';')

    return operator
}

const get = (str) => {
    str = str.split(';').filter(item => item !== '').join(';')

    return str
}

export default {
    set,
    get
}
