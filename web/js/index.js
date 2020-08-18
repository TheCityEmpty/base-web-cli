import '../style.css'
import '../css/index.less'
import $ from 'jquery'

// $.ajax({
//   type: 'GET',
//   url: 'https://www.tianqiapi.com/api/',
//   data: 'version=v1&city=南京&appid=23035354&appsecret=8YvlPNrz',
//   dataType: 'JSON',
//   error: function () {
//       alert('网络错误');
//   },
//   success: function (res) {
//       $('#box').append('<li>City: ' + res.city + '</li>');
//       $('#box').append('<li>Weather: ' + res.data[0].wea + '</li>');
//       $('#box').append('<li>Tips: ' + res.data[0].air_tips + '</li>');
//   }
// });
console.log('index4')
console.log(process.env.NODE_ENV)
console.log(APP__GLOBAL__VAR)

const dom = document.querySelectorAll('.header')
console.log(dom)