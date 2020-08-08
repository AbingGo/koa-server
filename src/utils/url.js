export const urlFilter = (originalUrl, pattern) => {
    const reg = new RegExp(pattern)

    return reg.test(originalUrl)
}
