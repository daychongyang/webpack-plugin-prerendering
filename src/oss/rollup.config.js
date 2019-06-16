// rollup.config.js
import babel from 'rollup-plugin-babel'
import path from 'path'
export default {
  input: path.resolve(__dirname, 'index.js'),
  output: {
    // file: '/Users/dcy/@Day/awesome-react/build/plugins/oss.js',
    file: '/Users/dcy/Workspace/aihuishou/portal-fe/build/plugins/oss.js',
    format: 'cjs'
  },
  plugins: [babel()]
}
