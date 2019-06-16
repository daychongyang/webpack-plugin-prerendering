import http from 'http'
import path from 'path'
import express from 'express'

export default class Server {
  constructor(config) {
    this._config = config
    this.app = express()
  }

  init() {
    const {
      staticPath = path.resolve(process.cwd(), 'dist'),
      port = 9527
    } = this._config
    this.app.use(express.static(staticPath))
    this.app.use('/**', function(req, res) {
      res.sendFile(staticPath + '/index.html', { maxAge: 0 })
    })

    const server = http.createServer(this.app)
    server.listen(port, () => {
      console.log(`Static Server has runing at localhost:${port}`)
    })

    return server
  }
}
