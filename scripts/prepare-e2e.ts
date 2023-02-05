import path from 'path'
import fse from 'fs-extra'
import * as execa from 'execa'

const exampleDir = path.resolve(__dirname, '../e2e/background/basic')

const defaultExecaOpts = {
  cwd: exampleDir,
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
}

/**
 * 准备执行e2e测试
 */
async function prepareE2E() {
  // 保证打包后的文件存在
  if (!fse.existsSync(path.resolve(__dirname, '../dist'))) {
    //  需要执行pnpm run build 进行打包
    execa.execaCommand('pnpm build', {
      ...defaultExecaOpts,
      cwd: path.resolve(__dirname, '../')
    })
  }

  // 存在dist后，需要启动一个无头浏览器 npx playwright install

  execa.execaCommandSync('npx playwright install', {
    ...defaultExecaOpts,
    cwd: path.resolve(__dirname, '../')
  })

  //   执行pnpm i, 这个需要在测试用例当中进行安装
  execa.execaCommandSync('pnpm i', defaultExecaOpts)

  //启动服务
  execa.execaCommandSync('pnpm dev', defaultExecaOpts)
}

prepareE2E()
