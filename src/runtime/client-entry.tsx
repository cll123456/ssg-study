import { createRoot } from 'react-dom/client'
import { App } from './App'
import siteData from 'ssg:site-data'
console.log(
  '%c [ siteData ]-4',
  'font-size:13px; background:pink; color:#bf2c9f;',
  siteData
)

/**
 * 浏览器中渲染
 */
function renderInBrowser() {
  const containerEl = document.getElementById('root')
  if (!containerEl) {
    throw new Error('#root element not found')
  }
  createRoot(containerEl).render(<App />)
}

renderInBrowser()
