import { Plugin } from 'vite'
import { SiteConfig } from '../../shared/types/index'
import { relative } from 'path'
const SITE_DATA_ID = 'ssg:site-data'
export function configPlugin(
  config: SiteConfig,
  restartServe: () => Promise<void>
): Plugin {
  return {
    name: 'ssg:config',
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath.replaceAll('\\', '/')]

      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file))

      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        )
        // 重启devCreateServe
        await restartServe()
      }
    }
  }
}
