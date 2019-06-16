// rollup.config.js
import path from 'path'
import babel from 'rollup-plugin-babel'

export default {
  input: path.resolve(__dirname, 'index.js'),
  output: {
    file: '/Users/dcy/@Day/prerendering-summary/build/prerendering.js',
    format: 'cjs'
  },
  plugins: [babel()]
}
