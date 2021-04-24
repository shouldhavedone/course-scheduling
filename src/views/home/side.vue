<template>
  <div class="menu-content" :class="isCollapse ? 'hide-content': ''">
    <div v-for="(item, index) in navMenus" :key="index">
      <el-menu-item
        v-if="!item.Menus || item.Menus.length == 0"
        :index="item.path ? item.path + '' : item.id + ''"
        :key="item.id"
        :class="getPath(item.path) ? 'is-active' : 'unactive-menu'"
      >
        <i class="iconfont icon" :class="item.icon"></i>
        <span slot="title">{{ item.name }}</span>
      </el-menu-item>
      <el-submenu :index="item.id + ''" :key="item.id" v-else>
        <template slot="title">
          <i class="iconfont icon" :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </template>
        <NavMenu :navMenus="item.Menus"></NavMenu>
      </el-submenu>
    </div>
  </div>
</template>
<script>
export default {
  props: ["navMenus", "isCollapse"],
  name: "NavMenu",
  data() {
    return {};
  },
  computed: {
    url() {
      return this.$route.path + "";
    },
  },
  methods: {
    getPath(path) {
      let url = path.includes("?") ? path.split("?")[0] : path;
      return this.url.includes(url);
    },
  },
};
</script>

<style lang="less">
.menu-content {
  .el-menu-item {
    color: #000 !important;
  }
  .el-submenu__title {
    color: #000 !important;
  }
  .icon {
    text-align: left;
    font-size: 16px;
    margin-right: 10px;
  }
}

.hide-content {
  .el-submenu__title span {
    display: none;
  }

  .el-submenu__icon-arrow {
    display: none;
  }
}

</style>
