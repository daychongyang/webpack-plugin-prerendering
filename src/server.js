import http from 'http'
import serveStatic from 'serve-static'
import finalhandler from 'finalhandler'

export default class Server {
  constructor(config) {
    this._config = config
  }

  init() {
    const { staticDir, port } = this._config

    const serve = serveStatic(staticDir, {
      index: ['index.html', 'index.htm']
    })

    const server = http.createServer((req, res) => {
      serve(req, res, finalhandler(req, res))
    })

    server.listen(port, () => {
      console.log('Static Server Init Success !!!')
    })
  }
}
