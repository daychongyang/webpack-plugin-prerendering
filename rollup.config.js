// rollup.config.js
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: '/Users/dcy/@Day/prerendering-summary/build/prerendering.js',
    format: 'cjs'
  },
  plugins: [babel()]
}
