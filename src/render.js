import path from 'path'
import writeHtml from './write-html'

export default async function render({
  browser,
  route,
  cdn,
  port,
  requestProcess,
  renderTimeout
}) {
  const currentPage = await browser.newPage()

  currentPage.setRequestInterception(true)

  currentPage.on('request', interceptedRequest => {
    const requestUrl = interceptedRequest.url()
    if (
      cdn &&
      requestUrl.startsWith(cdn) &&
      typeof requestProcess === 'function'
    ) {
      interceptedRequest.continue({
        url: requestProcess(requestUrl)
      })
    } else interceptedRequest.continue()
  })

  renderTimeout && (await page.waitFor(renderTimeout))

  await currentPage.on('load', async () => {
    const html = await currentPage.content()
    console.log(path.resolve(process.cwd(), `dist${route}`, 'index.html'))

    writeHtml(
      path.resolve(path.resolve(process.cwd(), `dist${route}`, 'index.html')),
      html
    )
    await currentPage.close()
  })
  await currentPage.goto(`http://localhost:${port}${route}`)
}
