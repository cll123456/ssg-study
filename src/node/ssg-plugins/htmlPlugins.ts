import { Plugin } from 'vite'
import fs from 'fs-extra'
import { DEFAULT_HTML_PATH, CLIENT_SRC_PATH } from '../constants'

/**
 * vite返回html插件
 * @returns
 */
export function htmlPlugin(): Plugin {
  return {
    name: 'sgg:index-html',
    apply: 'serve',
    // 插入入口 script 标签
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_SRC_PATH}`
            },
            injectTo: 'body'
          }
        ]
      }
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // 1. 读取html的内容
          let content = await fs.readFile(DEFAULT_HTML_PATH, 'utf-8')
          // 将读取到的内容返回给
          try {
            content = await server.transformIndexHtml(
              req.url,
              content,
              req.originalUrl
            )
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
