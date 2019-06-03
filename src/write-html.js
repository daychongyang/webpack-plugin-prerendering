import fs from 'fs'

export default function writeHtml(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) reject(err)
      resolve(`[${path}] has been saved!`)
    })
  })
}
