import { cac } from 'cac'
import path from 'path'
import { createDevServe } from './dev'
//  获取版本号
const version = require('./../../package.json').version

// 输入ssg -help 得到结果
const cli = cac('ssg').version(version).help()

cli.command('[root]', 'start dev server')
    .alias('dev')
    .action(async (root: string) => {
        root = root ? path.resolve(root) : process.cwd()
        const server = await createDevServe()
        await server.listen()
        server.printUrls()
        console.log('dev', root)
    })

cli.command('build [root]', 'build for production').action(async (root: string) => {
    console.log('build', root)
})

cli.parse()
