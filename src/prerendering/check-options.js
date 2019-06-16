export default function checkOptions(options) {
  const rules = {
    port: {
      type: 'number'
    },
    staticDir: {
      type: 'string',
      validator: item => item.startsWith('/')
    },
    indexPath: {
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
    cdn: {
      type: 'string'
    },
    postProcess: {
      type: 'function'
    },
    requestProcess: {
      type: 'function'
    },
    renderTimeout: {
      type: 'number'
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
  let isInvalid = false
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

  for (let key in options) {
    let optionValue = options[key]
    /** 传入配置项 值类型 */
    let optionValueType = getType(options[key])
    /** 对应配置项检查项 */
    let rule = rules[key] || {}
    /** 格式校验 */
    let validator = rule.validator

    /** 校验键值类型 */
    if (
      /** 无对应校验 */
      !rule ||
      /** 类型不对应 */
      optionValueType !== rule.type ||
      /** 额外的键值赋值 */
      (optionValueType === 'object' &&
        !Object.keys(optionValue).every(value =>
          Object.keys(rule[key]).includes(value)
        ))
    ) {
      isInvalid = true
      console.warn(
        `Prerendering Plugin: The option { ${key} }  currently set is invalid!`
      )
    }

    /** 格式校验 */
    if (validator) {
      if (optionValueType === 'string') {
        isInvalid = validator(optionValue) ? isInvalid : false
      } else if (optionValueType === 'array') {
        isInvalid = optionValue.every(validator) ? isInvalid : false
      }
    }
  }

  return isInvalid
}

const getType = v =>
  v === undefined
    ? 'undefined'
    : v === null
    ? 'null'
    : v.constructor.name.toLowerCase()
