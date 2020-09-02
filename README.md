# base-web-cli

=================

`base-web-cli` 使用原生js进行开发，为了方便起见， 内置了 `jQuery`，开发起来更加方便。支持js文件和css文件 的热更新。html 暂时需要主动刷新页面来进行更新。脚手架还内置了 `less` ，可直接使用。


## 安装

```
npm install -g base-web-cli
```

然后执行命令

```
base-web-cli
```
输入你的项目名称， 它将会创建该目录并将脚手架代码复制进去。

然后再去安装项目依赖和运行项目

```
npm install
npm run dev
```

现在你可以去愉快的开发了。

### js - babel
项目内置了 `babel` ，并将 `presets` 设置为 `@babel/preset-env`。支持绝大部分js 新语法。除了`js`文件外， 处于 `html` 中的
`script` 标签内的js也支持js新语法。但不建议这样做， 最好是一个 `html` 文件对应一个 `js` 文件。


### 模块化

#### js内

在 `js` 文件内支持常规的 `import` 和 `require`。

```js
import '../style.css' // 支持引入css, less 等
import $ from 'jquery' // 也可以引入依赖
import { getDate } from './utils.js' // 还可以引入 其他js 文件
```

#### html内

在 `script` 标签中不支持`import` 和 `require` 引入。 但是提供模板语法。

```html
<%= header %> // 引入 header.html 公共组件
<%= js!cli %> // 引入 cli.js 文件， 会自动用 <script></script> 标签包裹
<%= css!style %> // 引入 style.css 文件 （css同理）
```

`header` 和 `cli` 和 `style` 分别需定义在 `config.js` 文件中 `requireFileUrl` 字段配置 url。

```js
// config.js

module.exports = {
  requireFileUrl: {
    header: './web/header.html',
    cli: './web/js/cli.js',
    style: './web/css/style.css'
  }
}

```
#### css内
针对 `less`, 提供全局CSS变量， 定义在`config.js` 文件中的。这样在其他 `less` 文件中也可以直接使用该变量。
```js
// config.js

module.exports = {
  GlobalCSSVar: setGlobalCSSVar({
    '@mainColor': 'red',
    '@mainFontSize': '30px'
  })
}

```

并且提供 `include` 和 `exclude` 两个参数。

(include, exclude 支持正则表达式和纯字符串, 两个参数不可同时出现否则不起作用)

 include 包含哪些文件需要全局参数， 注意： 一旦启用这个参数，则不会在所有的less文件中注入全局变量，只是以此参数选择注入

 exclude 哪些文件不需要包含全局参数， 在include参数没定义时才起作用
 
 ```js
// config.js

module.exports = {
  GlobalCSSVar: setGlobalCSSVar({
    '@mainColor': 'red',
    '@mainFontSize': '30px'
  }),
  GlobalCSSVarOptions: {
    include: 'cli.less'
    // exclude: /cli\.less/
  }
}

```


### webpack 多页面
项目采用 `webpack` 构建， 使用多页面功能。 一个html文件对应一个js文件。 如：

`index.html` => `index.js`

js 文件应该放在 js文件夹目录下。否则识别不到路径。

每新增一个页面， 需要在 `config.js` 文件中的新增一个页面。项目启动后 默认打开数组第一个页面。
```js
// config.js

module.exports = { // 分别对应着 index.html , cli.html, res.html三个页面
   pages: [
    'index',
    'cli',
    'res'
  ]
}

```


### webpack 全局变量 环境变量

在 `config.js` 文件中有 `env` 环境变量， 分别为'dev'(开发环境) 和 'prd'(生产环境), 默认为dev。

并且有 `APP__GLOBAL__VAR_DEV` 和 `APP__GLOBAL__VAR_PRD` 两个全局变量对应着不同的环境。在整个项目不同地方可访问。
```js
// config.js

module.exports = {
  env: 'dev',
  APP__GLOBAL__VAR_DEV: {
    apiUrl: 'http://dev.openapi**'
  },
  APP__GLOBAL__VAR_PRD: {
    apiUrl: 'http://prd.openapi**'
  }
}
