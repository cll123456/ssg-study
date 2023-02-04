import { renderToString } from 'react-dom/server'
import { App } from './App'

/**
 * 服务端的render函数
 * @returns
 */
export function render() {
  return renderToString(<App />)
}
