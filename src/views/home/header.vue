<template>
  <div class="header-container">
    <div class="logo-container">
      <img src="../../assets/images/logo.png" alt />
    </div>

    <div class="content-wrap">
      <div class="left-container">
        <span @click="toggleNav(false)" v-if="hideNav">
          <i class="iconfont icontoggle-left"></i>
        </span>
        <span @click="toggleNav(true)" v-else>
          <i class="iconfont icontoggle-right"></i>
        </span>
      </div>
      <div class="right-container">
        <span @click="screenfull">
          <i class="iconfont iconeditor-screen-full"></i>
        </span>
        <span>
          <i class="iconfont iconziyuan"></i>
        </span>
        <el-dropdown  @command="dropdownClick">
          <span class="el-dropdown-link">
            你好! {{ username }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled divided command='changeType'>
              <i class="iconfont icontype"></i>修改主题
            </el-dropdown-item>
            <el-dropdown-item divided>
              <i class="iconfont iconuserinfo" command='userHome'></i>个人中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <i class="iconfont iconlog-out"></i>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import screenfull from "screenfull";
import { getSession } from "@/utils/auth"
export default {
  data() {
    return {
      isFullscreen: false,
      hideNav: false,
      username: JSON.parse(getSession('userInfo')).username,
    };
  },

  methods: {
    // 全屏事件
    screenfull() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "Your browser does not work",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = true;
    },

    // 是否全屏并按键ESC键
    checkFull() {
      var isFull =
        document.fullscreenEnabled ||
        window.fullScreen ||
        document.webkitIsFullScreen ||
        document.msFullscreenEnabled;
      if (isFull === undefined) {
        isFull = false;
      }
      return isFull;
    },

    toggleNav(val) {
      this.hideNav = val;
      this.$emit("toggleSide", val);
    },

    logout() {
      this.$store.commit("SET_TOKEN", null);
      this.$store.commit("SET_USER", "");
      this.$router.push('/login')
    },

    dropdownClick(command) {
      switch(command) {
        case 'logout': 
          this.logout();
          break;
        case 'userHome':
          break;
        case 'changeType' :
          break;
      }
    },
  },

  mounted() {
    window.onresize = () => {
      if (!this.checkFull()) {
        this.isFullscreen = false;
      }
    };
  }
};
</script>
<style lang="less">
@height: 100vh/960px;
@width: 100vw/1920px;
@width1: 240px * @width;

.header-container {
  height: 50px * @height;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo-container {
    height: 100%;
    width: @width1;
    padding: 6px * @height 30px * @width;

    img {
      height: 100%;
      width: 100%;
    }
  }

  .content-wrap {
    height: 100%;
    width: calc(100% - @width1);
    display: flex;
    justify-content: space-between;
  }

  .left-container {
    height: 100%;
    width: 200px * @width;
    display: flex;
    align-items: center;
    padding: 0 20px * @width;

    & > span {
      height: 40px * @height;
      line-height: 40px * @height;
      width: 40px * @width;
      border: 1px solid #efefef;
      border-radius: 100%;
      text-align: center;
      font-size: 14px;
      font-weight: 900;
      color: #000;

      &:hover {
        background-color: #ccc;
      }
    }
  }

  .right-container {
    width: 220px * @width;

    display: flex;
    justify-content: space-around;
    align-items: center;

    & > span {
      height: 40px * @height;
      line-height: 40px * @height;
      width: 40px * @width;
      border: 1px solid #efefef;
      border-radius: 100%;
      text-align: center;

      &:hover {
        background-color: #ccc;
      }
    }

    &:nth-child(2) {
      margin: 0 10px;
    }

    .el-dropdown-link {
      cursor: pointer;
      font-size: 12px;
      font-weight: 700;
    }
  }
}
</style>