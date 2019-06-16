import fs from 'fs'
import path from 'path'
import OSS from 'ali-oss'
import chalk from 'chalk'

/**
 * 插件的基本构成:
 * 1. 一个具名 JavaScript 函数
 * 2. 在它的原型上定义 apply 方法
 * 3. 指定一个触及到 webpack 本身的事件钩子
 * 4. 操作 webpack compilation 特定数据
 * 5. 在实现功能后调用 webpack 提供的 calllback
 * ! https://webpack.docschina.org/contribute/writing-a-plugin/
 */

export default class OSSPlugin {
  /**
   * Creates an instance of OSS.
   * @param {object} options
   * @memberof OSS
   * @property {string} region
   * @property {string} accessKeyId
   * @property {string} accessKeySecret
   * @property {string} bucket
   * @property {string} BUILDFOLDER
   * @property {string} PROJECT_NAME
   * @property {string} RESOURCE_PREFIX
   */

  constructor(options) {
    this._options = options
    this.platform = process.platform
    this.client = new OSS(options)
  }

  apply = compiler => {
    /** 编译资源 -> 磁盘 */
    compiler.hooks.afterEmit.tapAsync('OSS', this.afterEmit)
  }

  afterEmit = async (compilation, done) => {
    this.handleTraversing(this._options.BUILDFOLDER)
  }

  handleTraversing = buildFolder => {
    let files = fs.readdirSync(`${buildFolder}`)
    files.forEach(file => {
      let target = path.join(buildFolder, file)
      fs.statSync(target).isFile()
        ? this.handleUpload(target)
        : this.handleTraversing(target)
    })
  }

  handleUpload = async file => {
    try {
      const { PROJECT_NAME } = this._options
      let start = Date.now()

      let targetPath = this.platform.includes('win')
        ? file.split('\\').join('/')
        : file
      targetPath = targetPath.replace(/^dist[\/|\\](.*)/, '$1')

      await this.client.put(`b2b/${PROJECT_NAME}/${targetPath}`, `${file}`)
      let useTime = (new Date() - start) / 1000
      this.handleTips({
        targetPath,
        useTime
      })
    } catch (e) {
      console.log(e)
      process.exit(-1)
    }
  }

  handleTips = ({ targetPath, useTime }) => {
    console.log(
      `${chalk.cyan(`${targetPath}`)} ${chalk.green(`上传用时: ${useTime}`)}`
    )
  }
}
