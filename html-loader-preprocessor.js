const { requireFileUrl } = require('./config.js')
const babel = require("@babel/core")
const fs = require('fs')
const requireTempalteReg = /([^]*?)(<%=)([^]*?)(%>)([^]*?)/g
const scriptReg = /([^]*?)(<script>)([^]*?)(<\/script>)([^]*?)/g
const codeTypeMap = {
  html: '?',
  js: '<script>?</script>',
  css: '<style>?</style>'
} 
module.exports = function (htmlCode) {
    htmlCode = htmlCode.replace(scriptReg, (m, $1, $2, $3, $4, $5) => {
      return $1 + $2 + transformES2015($3) + $4 + $5 
    })
    const res = htmlCode.replace(requireTempalteReg, (m, $1, $2, $3, $4, $5) => {
      if ($3.indexOf('!') !== -1) {
        const codeType = $3.split('!')[0].trim()
        const fileUrl = $3.split('!')[1].trim()
        if (codeTypeMap[codeType]) {
          return  $1 + readFile(fileUrl, codeTypeMap[codeType], codeType) + $5
        } else {
          console.error(`请输入正确的codeType, 识别不了${codeType}类型！`)
          return ''
        }
      } else {
        return  $1 + readFile($3, codeTypeMap.html) + $5
      }
    })
    return res
}


/**
 * @description 提取对应路径下的 文件， 将文件内容注入到相应的html 中
 * @param {String} pathUrl  对应路径下
 * @param {String} replaceCode 对应不同文件的处理
 */
function readFile (pathUrl, replaceCode, codeType) {
  let sourceCode = ''
  pathUrl = pathUrl.trim()
  const p = requireFileUrl[pathUrl]
  try {
    sourceCode = fs.readFileSync(p, 'utf-8')
  } catch(e) {
    console.log(pathUrl, e, '路径不存在！')
  }
  if (codeType === 'js') {
    sourceCode = transformES2015(sourceCode)
  }
  return replaceCode.replace('?', sourceCode)
}

/**
 * @description 将源码转为 ES2015代码
 * @param {String} sourceCode 源码
 */
function transformES2015 (sourceCode) {
  return babel.transform(sourceCode, { presets: ['@babel/preset-env'] }).code
}



