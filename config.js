/**
 * @description base-web-cli 的单独配置
 * @param {Array} pages 所有页面 **注意：最后一个页面对应一个js文件（页面文件和js文件名字要相同），
 * 但是可以在此js文件中引入其他js文件, 数组第一个就是运行程序自动打开的页面。
 * @param {String} env 环境变量， 分别为 'dev'(开发环境) 和 'prd'(生产环境), 默认为dev
 * @param {Object} APP__GLOBAL__VAR_DEV dev环境中的全局变量， 可在任意地方访问到， 可用来设置 接口地址等公共硬编码
 * @param {Object} APP__GLOBAL__VAR_PRD prd环境中的全局变量
 * @param {String} GlobalCSSVar 为全局的less文件定义全局变量
 * @param {Object} GlobalCSSVarOptions 定义全局less变量参数
 *    (include, exclude 支持正则表达式和纯字符串, 两个参数不可同时出现否则不起作用)
 *    include 包含哪些文件需要全局参数， 注意： 一旦启用这个参数，则不会在所有的less文件中注入全局变量，只是以此参数选择注入
 *    exclude 哪些文件不需要包含全局参数， 在include参数没定义时才起作用
 */

module.exports = {
  pages: [
    'index',
    'cli'
  ],
  env: 'dev',
  APP__GLOBAL__VAR_DEV: {
    apiUrl: 'http://dev.openapi**'
  },
  APP__GLOBAL__VAR_PRD: {
    apiUrl: 'http://prd.openapi**'
  },
  requireFileUrl: {
    header: './web/header.html',
    Pages: './web/js/Pages.js',
    footer: './web/footer.html'
  },
  GlobalCSSVar: setGlobalCSSVar({
    '@mainColor': 'red',
    '@mainFontSize': '30px'
  }),
  GlobalCSSVarOptions: {
    include: 'cli.less'
    // exclude: /cli\.less/
  }
}

function setGlobalCSSVar (cssVar) {
  return Object.keys(cssVar).map(function (key) {
    return `${key}:${cssVar[key]};`
  }).join('\n')
}
