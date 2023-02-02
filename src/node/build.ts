import { build as viteBuild, InlineConfig } from 'vite'
import { CLIENT_SRC_PATH, SERVER_SRC_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import { join } from 'path'
import fs from 'fs-extra'
import ora from 'ora'
import { pathToFileURL } from 'url'

let spinner

/**
 * 打包bundle
 * @param root
 * @returns [RollupOutput, RollupOutput]
 */
export async function buildBundle(root: string) {
    /**
     * vite打包配置
     * @param isSsr {boolean} 是否是ssr
     * @returns
     */
    const buildViteConfig = (isSsr: boolean = false): InlineConfig => {
        return {
            mode: 'production',
            root,
            build: {
                ssr: isSsr,
                outDir: isSsr ? '.temp' : 'build',
                rollupOptions: {
                    input: isSsr ? SERVER_SRC_PATH : CLIENT_SRC_PATH,
                    output: {
                        format: isSsr ? 'cjs' : 'esm'
                    }
                }
            }
        }
    }

    /**
     * 打包客户端
     * @returns
     */
    const buildClient = async () => {
        return viteBuild(buildViteConfig(false))
    }

    /**
     * 打包服务端
     * @returns
     */
    const buildServer = async () => {
        return viteBuild(buildViteConfig(true))
    }
    spinner = ora({
        text: 'Building client + server bundles...'
    })
    spinner.info(`start to build...`)

    // spinner.start()
    try {
        const [clientBundle, serverBundle] = await Promise.all([buildClient(), buildServer()])
        return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
    } catch (error) {
        console.log(error)
    }
}

/**
 * 渲染页面
 * @param render
 * @param root
 * @param clientBundle
 */
export async function renderPage(render: () => string, root: string, clientBundle: RollupOutput) {
    // 获取客户端打包出来的js的能力
    const clientBundleFileName = clientBundle.output.find(chunk => chunk.type === 'chunk' && chunk.isEntry).fileName
    spinner.succeed('finish build')
    spinner.stop()
    const appHtml = render()
    // 写入的html内容
    let content = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
        </head>
        <body>
           ${appHtml}
           <script type="module" src="${clientBundleFileName}"></script>
        </body>
    </html>
    `.trim()
    // 判断build目录存在

    const res = await fs.ensureDir(join(root, 'build'))
    // 写入到build目录
    await fs.writeFile(join(root, 'build', 'index.html'), content)
    // 删除 .temp文件
    await fs.remove(join(root, '.temp'))
}

/**
 * cli 打包
 * @param root
 */
export async function build(root: string = process.cwd()) {
    // 1. 打包客户端和服务端
    const [clientBundle, serverBundle] = await buildBundle(root)

    // 2. 引入server-entry 模块
    const serverBundlePath = serverBundle.output.find(chunk => chunk.type === 'chunk' && chunk.name === 'server-entry').fileName
    const { render } = await import(pathToFileURL(join(root, '.temp', serverBundlePath)).toString())
    // 3. 产出html写入磁盘
    await renderPage(render, root, clientBundle)
}
