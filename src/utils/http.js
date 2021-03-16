import axios from "axios";
import routes from "../router.js";
import store from "../store/index.js";
import { Message } from "element-ui";
import URL from "../api/baseUrl.js";
import { showFullScreenLoading, tryHideFullScreenLoading } from "./auth";
export const http = axios.create({
  baseURL: URL,
  timeout: 1000 * 60 * 2,
  loading: false,
  withCredentials: false, //跨域请求同自带cookie
});

// 请求拦截器,在请求发出之前进行一些操作
http.interceptors.request.use(
  function(config) {
    let token = store.state.token;
    if (config.url.split("?")[0] == "/back-auth/oauth/token") {
      config.headers["Authorization"] = "Basic dml0b0FwcDp2aXRvc2VjcmV0";
    } else {
      if (token) {
        config.headers["Authorization"] = token;
      }
      if (config.loading) {
        http.showLoading = true;
        showFullScreenLoading();
      }
    }
    return config;
  },
  function(error) {
    Message.error("请求失败,请重试");
    return Promise.reject(error);
  }
);

//响应拦截器异常处理
http.interceptors.response.use(
  response => {
    if (response && response.data.code !== 200 && response.data.code !== 1) {
      if (response.data.code === 401) {
        sessionStorage.clear();
        store.commit("DEL_TOKEN");
        routes.replace({
          path: "/login",
        });
      }
      if (response.data.message) {
        Message.error(`${response.data.message}`);
      }
    } else if (!response) {
      Message.error(`连接错误`);
    }
    tryHideFullScreenLoading();
    return response.data;
  },
  (err) => {
    tryHideFullScreenLoading();
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          Message.error("错误请求");
          break;
        case 404:
          Message.error("当前资源不存在");
          break;
        case 500:
          Message.error("服务器忙，请重试");
          break;
        case 401:
          sessionStorage.clear();
          store.commit("DEL_TOKEN");
          Message.error("未授权，请重新登录");
          routes.replace({
            path: "/login",
          });
          break;
        case 403:
          Message.error("拒绝访问");
          break;
        case 408:
          Message.error("请求超时");
          break;
        case 502:
          Message.error("网络错误");
          break;
        case 503:
          Message.error("服务不可用");
          break;
        // case 426:
        //   Message.error('用户名或密码错误');
        //   break;
        default:
          Message.error(`连接错误`);
      }
    } else {
      Message.error(`当前网络不可用 请稍后重试`);
    }
    return false;
  }
);

http.all = axios.all;

//定义插件的配置来扩展 Vue 本身
const httpPlugin = {};
httpPlugin.install = function(Vue, options) {
  Vue.prototype.$http = http;
};

export default httpPlugin;
