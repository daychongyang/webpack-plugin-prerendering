import path from 'path'

export default function render({
  browser,
  route,
  cdn,
  port,
  requestProcess,
  renderTimeout,
  compilerFS
}) {
  return new Promise(async (resolve, reject) => {
    const mkdirp = function(dir, opts) {
      return new Promise((resolve, reject) => {
        compilerFS.mkdirp(dir, opts, (err, made) =>
          err === null ? resolve(made) : reject(err)
        )
      })
    }

    const currentPage = await browser.newPage()

    currentPage.setRequestInterception(true)

    currentPage.on('request', interceptedRequest => {
      const requestUrl = interceptedRequest.url()
      console.log(requestUrl)
      if (
        cdn &&
        requestUrl.startsWith(cdn) &&
        typeof requestProcess === 'function'
      ) {
        console.log(requestProcess(requestUrl))
        interceptedRequest.continue({
          url: requestProcess(requestUrl)
        })
      } else interceptedRequest.continue()
    })

    renderTimeout && (await currentPage.waitFor(renderTimeout))

    await currentPage.on('load', async () => {
      const html = await currentPage.content()

      const outputPath = path.resolve(
        path.resolve(process.cwd(), `dist${route}`)
      )

      await mkdirp(outputPath)

      await compilerFS.writeFile(`${outputPath}/index.html`, html, err => {
        if (err) {
          console.error(
            `[Prerendering plugin] Unable to write rendered route to file "${outputPath}" \n ${err}.`
          )
        } else {
          console.info(
            `[Prerendering plugin] Success to write rendered route to file "${outputPath}" \n.`
          )
        }
      })

      // await currentPage.close()

      // resolve()
    })
    await currentPage.goto(`http://localhost:${port}${route}`)
  })
}
