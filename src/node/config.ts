import fs from 'fs-extra'
import { resolve } from 'path'
import { loadConfigFromFile } from 'vite'
import { UserConfig } from '../shared/typed/index'

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>)

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js']
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find((file) => fs.pathExistsSync(file))

    return configPath
  } catch (error) {
    console.log('can not find the config file')
    throw error
  }
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'production' | 'development'
) {
  // 1. 获取配置文件路径
  const configPath = getUserConfigPath(root)
  // 2. 读取配置文件的内容

  const result = await loadConfigFromFile(
    {
      command,
      mode
    },
    configPath,
    root
  )

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result
    // 将配置文件的内容给解析出来，有3种情况
    // 1. 返回的是对象
    // 2. 返回的是函数
    // 3. 返回的是promise, promise里面返回的是对象或者函数
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig)
    return [configPath, userConfig] as const
  } else {
    return [configPath, {} as RawConfig] as const
  }
}
