import { createServer as createViteServer } from 'vite'

/**
 * 创建开发环境的服务
 * @param root 根路径
 * @returns 
 */
export async function createDevServe(root = process.cwd()) {
    return createViteServer({
        root
    })
}
