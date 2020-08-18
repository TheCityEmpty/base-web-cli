const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const handleHtmlFn = require('./html-loader-preprocessor.js')
const webpack = require('webpack')
const path = require('path')
const {
  pages,
  env,
  APP__GLOBAL__VAR_DEV,
  APP__GLOBAL__VAR_PRD,
  GlobalCSSVar,
  GlobalCSSVarOptions
} = require('./config.js')

const entryObj = {}
const htmlArr = []

pages.forEach(i => {
  htmlArr.push(new HtmlWebpackPlugin({
    filename: `${i}.html`,
    template: `./web/${i}.html`,
    chunks: [i]
  }))
  entryObj[i] = `./web/js/${i}.js`
})

module.exports = {
  entry: entryObj,
  output: {
    filename: '[name].js',
    path: __dirname + '/dist/js'
  },
  plugins: [
    ...htmlArr,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      APP__GLOBAL__VAR: JSON.stringify(env === 'prd' ? APP__GLOBAL__VAR_PRD : APP__GLOBAL__VAR_DEV)
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.(jpg|png|jpeg|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'imgs/'
          }
        }
      },
      {
        test: /\.js$/,
        use:  {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              prependData: ({ resourcePath, rootContext }) => {
                const relativePath = path.relative(rootContext, resourcePath)
                let includeLess = GlobalCSSVarOptions.include
                let excludeLess = GlobalCSSVarOptions.exclude
                includeLess = isString(includeLess) ? new RegExp(includeLess) : includeLess
                excludeLess = isString(includeLess) ? new RegExp(excludeLess) : excludeLess
                
                if (includeLess && excludeLess) {
                  console.error('include 参数和 exclude 不可同时存在')
                  return  ''
                } else {
                  if (includeLess && includeLess.test(relativePath)) {
                    return GlobalCSSVar
                  } else if (excludeLess && excludeLess.test(relativePath)) {
                    return GlobalCSSVar
                  } else {
                    return ''
                  }
                }
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          preprocessor: (content, loaderContext) => {
            return handleHtmlFn(content)
          }
        }
      }
      
    ]
  },

  devServer: {
    hot: true,
    open: true,
    openPage: `${pages[0]}.html`
  }
}

function isString (val) {
  return Object.prototype.toString.call(val) === '[object String]'
}
