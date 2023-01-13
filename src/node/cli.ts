import { cac } from 'cac'
import path from 'path'
import { build } from './build'
import { createDevServe } from './dev'
// import pkg from './../../package.json'
//  获取版本号
const version = '1.0.0'

// 输入ssg -help 得到结果
const cli = cac('ssg').version(version).help()

cli.command('[root]', 'start dev server')
    .alias('dev')
    .action(async (root: string) => {
        root = root ? path.resolve(root) : process.cwd()
        console.log('dev', root)
        const server = await createDevServe(root)
        await server.listen()
        server.printUrls()
    })

cli.command('build [root]', 'build for production').action(async (root: string) => {
    console.log('build', root)
    try {
        root = root ? path.resolve(root) : process.cwd()
        await build(root)
    } catch (error) {
        console.log(error)
    }
})

cli.parse()
