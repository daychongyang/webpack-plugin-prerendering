import path from 'path'
import puppeteer from 'puppeteer'
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
   * @property {object} minify={ collapseBooleanAttributes: true,collapseWhitespace: true,decodeEntities: true,keepClosingSlash: true,sortAttributes: true}针对构建产物进行压缩
   */
  constructor(options) {
    // const { isIllegal, errorInfo } = this.checkOptions(options)
    // if (isIllegal) {
    //   throw new Error(errorInfo)
    // }

    this._options = options
  }

  apply = compiler => {
    /** 编译资源 -> 磁盘 */
    compiler.hooks.afterEmit.tapAsync('Prerendering', this.afterEmit)
  }

  afterEmit = async (compilation, done) => {
    const { headless = true, routes = [] } = this._options
    try {
      const browser = await puppeteer.launch({
        headless
      })

      const currentPage = await browser.newPage()
      currentPage.setRequestInterception(true)

      currentPage.on('request', interceptedRequest => {
        console.log(interceptedRequest.url())
        if (interceptedRequest.url().startsWith('https://www.baidu.com/img/')) {
          interceptedRequest.continue({
            url: 'http://localhost:9527/daily.png'
          })
        } else interceptedRequest.continue()
      })

      await currentPage.goto('https://baidu.com')

      await currentPage.screenshot({
        path: 'example.png'
      })
    } catch (e) {
      console.error(e)
    }
  }

  checkOptions = options => {
    const CorrespondingType = {
      staticDir: {
        type: 'string',
        validator: item => item.startsWith('/')
      },
      staticDir: {
        type: 'string',
        validator: item => item.startsWith('/')
      },
      outputDir: {
        type: 'string',
        validator: item => item.startsWith('/')
      },
      indexPath: {
        type: 'string',
        validator: item => item.startsWith('/')
      },
      routes: {
        type: 'array',
        validator: item => item.startsWith('/')
      },
      headless: {
        type: 'boolean'
      },
      postProcess: {
        type: 'function'
      },
      minify: {
        type: 'object',
        standard: [
          'collapseBooleanAttributes',
          'collapseWhitespace',
          'decodeEntities',
          'keepClosingSlash',
          'sortAttributes'
        ]
      }
    }

    const {
      staticDir,
      outputDir,
      indexPath,
      routes,
      headless,
      postProcess,
      port,
      minify
    } = options
  }

  getType = v =>
    v === undefined
      ? 'undefined'
      : v === null
      ? 'null'
      : v.constructor.name.toLowerCase()
}
