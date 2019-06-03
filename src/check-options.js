export default function checkOptions(options) {
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

const getType = v =>
  v === undefined
    ? 'undefined'
    : v === null
    ? 'null'
    : v.constructor.name.toLowerCase()
