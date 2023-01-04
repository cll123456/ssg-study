import { Plugin } from 'vite'
import { readFile } from 'fs/promises'
import { DEFAULT_HTML_PATH } from '../constants'

/**
 * vite返回html插件
 * @returns
 */
export function htmlPlugin(): Plugin {
    return {
        name: 'sgg:index-html',
        apply: 'serve',
        configureServer(server) {
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    // 1. 读取html的内容
                    const content = await readFile(DEFAULT_HTML_PATH, 'utf-8')

                    // 将读取到的内容返回给
                    try {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'text/html')
                        res.end(content)
                    } catch (error) {
                        return next(error)
                    }
                })
            }
        }
    }
}
