<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <cheader :isCollapse="isCollapse" @toggleSide="toggleSide"></cheader>
      </el-header>
      <el-container class="content-wrap">
        <el-aside>
          <div class="menu">
            <el-scrollbar ref="myScrollbar">
              <el-menu
                :collapse="isCollapse"
                :deault-active="$route.path"
                class="el-menu-vertical-demo"
                :default-openeds="openSubs"
                :unique-opened="true"
                text-color="#fff"
                router
              >
                <cside :navMenus="menuList" :isCollapse="isCollapse"></cside>
              </el-menu>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-main>
          <router-view
            v-if="!$route.meta.keepalive"
            :key="$route.path"
          ></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import cheader from "./header";
import cside from "./side";
import api from '@/api'
export default {
  components: {
    cheader,
    cside,
  },

  data() {
    return {
      openSubs: ["1"],
      isCollapse: false,
      menuList: [],
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },

  mounted() {
    this.getMenu();
  },

  methods: {
    async getMenu() {
      const params = {
        role_id: this.userInfo.role_id,
      };
      const res = await this.$http.post(api.getMenu, params);
      if(res && res.isSucceed) {
        this.menuList = res.data
      }
    },

    toggleSide(val) {
      this.isCollapse = val;
    },
  },
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;

.app-container {
  height: 100%;
  width: 100%;

  & > :first-child {
    height: 100%;
  }

  .el-header {
    padding: 0;
  }

  .content-wrap {
    height: 100%;
    .el-aside {
      width: auto !important;
      .menu {
        height: 100%;
      }
    }

    .el-main {
      padding: 12px * @height 20px * @width;
    }
  }

  .el-scrollbar {
    height: 100%;

    .el-scrollbar__view {
      height: 100%;
    }

    .el-menu {
      height: 100%;
    }
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  color: #000;
  width: 240px * @width;
}
</style>