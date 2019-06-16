import puppeteer from 'puppeteer'
import checkOptions from './check-options'
import Server from './server'
import render from './render'

/**
 * 插件的基本构成:
 * 1. 一个具名 JavaScript 函数
 * 2. 在它的原型上定义 apply 方法
 * 3. 指定一个触及到 webpack 本身的事件钩子
 * 4. 操作 webpack compilation 特定数据
 * 5. 在实现功能后调用 webpack 提供的 calllback
 * ! https://webpack.docschina.org/contribute/writing-a-plugin/
 */

export default class Prerendering {
  /**
   * Creates an instance of Prerendering.
   * @param {object} options
   * @memberof Prerendering
   * @property {string} staticDir=dist - webpack 将编译资源写入磁盘的目录
   * @property {string} outputDir=dist - 预渲染插件输出构建资源的目录
   * @property {string} indexPath=dist/index.html - 应用首页路径
   * @property {array} routes=[] - 需进行预渲染的页面路径集合
   * @property {boolean} headless=true - Chromium headeless 模式
   * @property {func} postProcess=()=>{} - 针对构建结果及输出目录进行修正
   * @property {func} port=()=>{} - 预渲染服务端口
   * @property {object} minify={ collapseBooleanAttributes: true,collapseWhitespace: true,decodeEntities: true,keepClosingSlash: true,sortAttributes: true}针对构建产物进行压缩
   * @property {string} cdn='' CDN 字符串
   * @property {number} renderTimeout=0 几秒后渲染
   * @property {func} requestProcess=()=>{} 针对CDN资源做拦截处理
   */
  constructor(options) {
    const isInvalid = checkOptions(options)
    if (isInvalid) {
      throw new Error(`Initialization failed !`)
    }

    const { staticDir, port = 9527 } = options

    this._options = options
    this._server = new Server({ staticDir, port })
  }

  apply = compiler => {
    /** 编译资源 -> 磁盘 */
    this._compiler = compiler
    compiler.hooks.afterEmit.tapPromise('Prerendering', this.afterEmit)
  }

  afterEmit = compilation =>
    new Promise(async (resolve, reject) => {
      const {
        cdn,
        port,
        headless = true,
        routes = [],
        requestProcess,
        renderTimeout
      } = this._options
      try {
        const server = this._server.init()

        const browser = await puppeteer.launch({
          headless
        })

        Promise.all(
          routes.map(async route =>
            render({
              cdn,
              port,
              route,
              browser,
              requestProcess,
              renderTimeout,
              compilerFS: this._compiler.outputFileSystem
            })
          )
        ).then(() => {
          console.log('Prerendering Success!')

          /** 查看实际效果 */
          server.close()
          browser.close()
          resolve()
        })
      } catch (e) {
        reject()
        console.error(e)
      }
    })
}
