import * as path from 'path'

/**
 * template的跟路径
 */
const PACKAGE_ROOT = path.join(__dirname, '..')

/**
 * 默认template.html目标的路径
 */
export const DEFAULT_HTML_PATH = path.join(PACKAGE_ROOT, 'template.html')

/**
 * 默认插入body的src内容, 客户端的路径
 */
export const CLIENT_SRC_PATH = path.join(PACKAGE_ROOT, 'src', 'runtime', 'client-entry.tsx')

/**
 * 服务端的入口
 */
export const SERVER_SRC_PATH = path.join(PACKAGE_ROOT, 'src', 'runtime', 'server-entry.tsx')
