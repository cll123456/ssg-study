import * as path from 'path'

/**
 * tempate的跟路径
 */
const PACKAGE_ROOT = path.join(__dirname, '..', '..', '..')

/**
 * 默认template.html目标的路径
 */
export const DEFAULT_HTML_PATH = path.join(PACKAGE_ROOT, 'template.html')

/**
 * 默认插入body的src内容
 */
export const INSERT_SRC_PATH = path.join(PACKAGE_ROOT, 'src', 'runtime', 'client-entry.tsx')
