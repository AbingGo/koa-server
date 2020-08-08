'use strict'

const mainBranches = ['master1']
const colors = require('colors')
const childProcess = require('child_process')
const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().replace(/\s+/, '')

const isMainBranch = (() => {
    return mainBranches.indexOf(branch) >= 0
})()

if (isMainBranch) {
    console.log(colors.red('代码commit失败'))
    console.log(colors.red('message: 提交代码流程不符合规范，请不要直接在主分支上提交代码.\n'))
    console.log('可参考以下方法： \n')

    console.log(colors.green('1.建立本地开发分支 \n'))
    console.log(colors.green('2.在本地分支提交 \n'))
    console.log(colors.green('3.rebase 主分支 \n'))
    console.log(colors.green('4.在主分支 merge本地分支 \n'))
    process.exit(1)
}
process.exit(0)
