<template>
  <div class="app-container">
    <el-container>
      <el-header>
        <cheader :isCollapse="isCollapse" @toggleNav="toggleNav"></cheader>
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
                <cside :navMenus="menuList"></cside>
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
export default {
  components: {
    cheader,
    cside,
  },

  data() {
    return {
      menuList: [
        {
          id: "1",
          icon: "iconblog",
          name: "排课管理",
          url: "/blog",
          children: [
            {
              id: "1-1",
              url: "/blog/home",
              icon: "icontongji",
              name: "课程计划",
            },
            {
              id: "1-2",
              url: '/blog/home',
              icon: "iconarticle",
              name: "查看课表",
            },
          ],
        },
        {
          id: '2',
          icon: 'iconblog',
          name: '课程管理',
          url: '/blog',
        },
        {
          id: '3',
          icon: 'iconblog',
          name: '讲师管理',
          url: '/blog',
        },
        {
          id: '4',
          icon: 'iconblog',
          name: '班级管理',
          url: '/blog',
        },
        {
          id: '5',
          icon: 'iconblog',
          name: '学生管理',
          url: '/blog',
        },
        {
          id: '6',
          icon: 'iconblog',
          name: '教室管理',
          url: '/classroom',
          children: [
            {
              id: "6-1",
              url: "/blog/home",
              icon: "icontongji",
              name: "教学区域管理",
            },
            {
              id: "6-2",
              url: "/blog/home",
              icon: "iconarticle",
              name: "教室管理",
            },
          ],
        },
        {
          id: "10",
          icon: "iconshezhi",
          name: "系统设置",
          url: "/setting",
          children: [
            {
              id: "10-1",
              url: "/blog/home",
              icon: "icontongji",
              name: "菜单管理",
            },
            {
              id: "10-2",
              url: "/blog/home",
              icon: "icontongji",
              name: "角色管理",
            },
            {
              id: "10-3",
              url: "/blog/home",
              icon: "iconarticle",
              name: "用户管理",
            },
          ],
        },
      ],
      openSubs: ["1"],
      isCollapse: false,
    };
  },

  methods: {
    toggleNav(val) {
      console.log(val);
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