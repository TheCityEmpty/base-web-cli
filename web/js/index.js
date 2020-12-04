import '../style.css'
import '../css/index.less'
import $ from 'jquery'

console.log('index4')
console.log(process.env.NODE_ENV)
console.log(APP__GLOBAL__VAR)

init()

async function init () {
  const res = await fn()
  console.log(res)
}

function fn () {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove('how are you')
    }, 1000)
  })
}