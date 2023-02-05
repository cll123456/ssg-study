import { createServer } from 'vite'
import { htmlPlugin } from './ssg-plugins/htmlPlugins'
import pluginReact from '@vitejs/plugin-react'
import { PACKAGE_ROOT } from './constants/index'
/**
 * 创建开发环境的服务
 * @param root 根路径
 * @returns
 */
export async function createDevServe(root = process.cwd()) {
  return createServer({
    root,
    plugins: [htmlPlugin(), pluginReact()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  })
}
