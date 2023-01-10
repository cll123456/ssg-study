import { build as viteBuild, InlineConfig } from 'vite'
import { CLIENT_SRC_PATH, SERVER_SRC_PATH } from './constants'
import type { RollupOutput } from 'rollup'
import path from 'path'

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

    try {
        const [clientBundle, serverBundle] = await Promise.all([buildClient(), buildServer()])
        return [clientBundle, serverBundle] as [RollupOutput, RollupOutput]
    } catch (error) {
        console.log(error)
    }
}

/**
 * cli 打包
 * @param root
 */
export async function build(root: string = process.cwd()) {
    // 1. 打包客户端和服务端
    const [clientBundle, serverBundle] = await buildBundle(root)

    // 2. 引入server-entry 模块
    const render = require(path.join(root, '.temp', serverBundle.output.find(chunk => chunk.type === 'chunk' && chunk.name === 'server-entry').fileName))

    console.log(render)
    // 3. 产出html写入磁盘
}