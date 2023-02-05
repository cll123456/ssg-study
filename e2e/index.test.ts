import { test, expect } from '@playwright/test'

const siteUrl = 'http://localhost:5173'

test('validate page is right', async ({ page }) => {
  await page.goto(siteUrl)

  //   拿到当前页面的内容
  const res = await page.evaluate(async () => {
    const pageContent = document.body.innerText
    return pageContent.includes('This is Layout Component')
  })

  expect(res).toBe(true)
})
