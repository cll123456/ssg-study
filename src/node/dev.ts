import { createServer } from 'vite'
import { htmlPlugin } from './ssg-plugins/htmlPlugins'
import pluginReact from '@vitejs/plugin-react'
import { PACKAGE_ROOT } from './constants/index'
import { resolveConfig } from './config'
import { configPlugin } from './ssg-plugins/configPlugin'

/**
 * 创建开发环境的服务
 * @param root 根路径
 * @returns
 */
export async function createDevServe(
  root = process.cwd(),
  restartServe: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development')
  console.log(
    '%c [ config ]-13',
    'font-size:13px; background:pink; color:#bf2c9f;',
    config
  )
  return createServer({
    root,
    plugins: [htmlPlugin(), pluginReact(), configPlugin(config, restartServe)],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  })
}
