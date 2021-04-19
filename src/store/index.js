import Vue from "vue"
import Vuex from "vuex"
import { getSession, setSession, delSession } from "@/utils/auth"

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {},
  state: {
    userInfo: getSession("userInfo")
      ? JSON.parse(getSession("userInfo"))
      : {},
    token: getSession("userInfo"),
    sendList: [],
  },
  mutations: {
    // 将token存入vuex和session中
    SET_TOKEN(state, token) {
      if (token) {
        setSession("token", token);
        state.token = token;
      } else if (token == null) {
        delSession("token");
        state.token = null;
      }
    },
    // 将用户信息存入vuex和session中
    SET_USER(state, user) {
      setSession("userInfo", JSON.stringify(user));
      state.userInfo = user;
    },
    DEL_TOKEN(state) {
      state.token = "";
      state.userInfo = {};
      sessionStorage.clear();
    },
    // -----------------推送-----------------------------
    // 推送的文章列表
    SET_SEND_LIST(state, data) {
      this.state[data.name].push(data.item);
      setSession(data.name, this.state[data.name]);
    },
    // 删除要发送的文章
    DEL_ARTICLE(state, data) {
      state[data.name].splice(data.index, 1);
      setSession(data.name, this.state[data.name]);
    },
    // 改变文章的顺序
    CHANGE_ARTICLE_SORT(state, data) {
      let sendData = state[data.name];
      let temp = sendData[data.index - 1];
      sendData[data.index - 1] = sendData[data.index];
      sendData[data.index] = temp;
      state[data.name] = [...sendData];
      setSession(data.name, this.state[data.name]);
    },
    DEL_ALL_ARTICLES(state, name) {
      state[name] = [];
      setSession(name, this.state[name]);
    },
  },
  actions: {},
});