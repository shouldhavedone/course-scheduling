
import { Loading } from 'element-ui'
import Vue from 'vue'
import router from '../router'

//获取sessionStorage存储数据
export const getSession = name => {
  if (!name) return
  return window.sessionStorage.getItem(name)
}

//设置sessionStorage存储数据
export const setSession = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

//删除sessionStorage存储数据
export const delSession = (name) => {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

// 将对象拼接成字符串
export const objToStr = function (val) {
  if (val) {
    let params = '';
    for (let x in val) {
      if (val[x]) {
        params += `${x}=${val[x]}&`
      }
    }
    params = params.substr(0, params.length - 1);
    return params
  }
}

// 防抖
export const _debounce = function (fn, delay) {
  var delay1 = delay || 500;
  var timer;
  return function () {
    var th = this;
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      timer = null;
      fn.apply(th, args);
    }, delay1);
  };
}

//节流立即执行
export const _throttle = function (func, wait) {
  let previous = 0;
  return function () {
    let now = Date.now();
    let context = this;
    let args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  }
}

// 跳转页面
export const goPage = function (url) {
  if (!url) return false;
  router.push({ path: url });
}

let loading, timer, needLoadingRequestCount = 0;

// 开始loading
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: 'Loading...',
    spinner: 'el-icon-loading',
    background: 'rgba(255,255,255,.5)'
  })
}

//打开loading
export function showFullScreenLoading(time = 300) {
  if (needLoadingRequestCount === 0) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      startLoading()
    }, time);
  }
  needLoadingRequestCount++
}

//关闭loading
export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    if (timer) clearTimeout(timer);
    setTimeout(() => {
      if (loading) loading.close()
    }, 300)
  }
}

// 时间过滤器 格式有 yyyy-MM-dd yyyy-MM-dd hh:mm:ss等
Vue.filter('validateTime', (Time, Type, str) => {
  if (!Time) return '暂无时间'
  let time = new Date(Time)
  let type = Type || 'yyyy-MM-dd hh:mm:ss'
  let args = {
    'M+': time.getMonth() + 1,
    'd+': time.getDate(),
    'h+': time.getHours(),
    'm+': time.getMinutes(),
    's+': time.getSeconds(),
    'q+': Math.floor((time.getMonth() + 3) / 3),
    'S': time.getMilliseconds()
  }
  if (/(y+)/.test(type)) {
    type = type.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let i in args) {
    let n = args[i]
    if (new RegExp('(' + i + ')').test(type)) {
      type = type.replace(RegExp.$1, RegExp.$1.length === 1 ? n : ('00' + n).substr(('' + n).length))
    }
  }
  return str ? type + str : type
})

// 格式化时间为 'yyyy-MM-dd hh:mm:ss'
export function dateFormat(date, fmt) {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 获取参数
export function getRequest(path) {
  var url = decodeURI(decodeURI(path)); //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") !== -1) {
    var str = url.split("?")[1];
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = strs[i].substring(strs[i].indexOf('=') + 1);
    }
  }
  return theRequest;
}

// 获取当前时间(格式)
export const getNowFormatDate = function () {
  let date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  var currentdate = year + '年' + month + '月';
  return currentdate;
}

// 下载
export const download = function (data, filename) {
  if (!data) {
    return;
  }
  let jpgData = new Blob([data]);
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(jpgData, filename);
  } else {
    let url = window.URL.createObjectURL(new Blob([data]));
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }
}

// 手机号验证
function isValidTel(str) {
  const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
  return reg.test(str)
}

// 邮箱验证
function isValidEmail(str) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  return reg.test(str)
}

export const validTel = (rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号不能为空'))
  } else if (!isValidTel(value)) {
    callback(new Error('请输入正确的11位手机号码'))
  } else {
    callback()
  }
}

export const validEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('邮箱不能为空'))
  } else if (!isValidEmail(value)) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
