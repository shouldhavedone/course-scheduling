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
        <el-dropdown @command="dropdownClick">
          <span class="el-dropdown-link">
            你好! {{ username }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled divided command="changeType">
              <i class="iconfont icontype"></i>修改主题
            </el-dropdown-item>
            <el-dropdown-item divided command="modifyUser">
              <i class="iconfont iconuserinfo"></i>修改账户
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <i class="iconfont iconlog-out"></i>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="修改个人信息" :visible.sync="dialogVisible">
      <el-form :model="reqData" label-width="80px" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="reqData.username"
            placeholder="请输入用户名"
            clearable
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="password">
          <el-input
            type="password"
            v-model="reqData.password"
            autocomplete="off"
            placeholder="请输入旧密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword">
          <el-input
            type="password"
            v-model="reqData.newpassword"
            autocomplete="off"
            placeholder="请输入新密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input
            type="password"
            v-model="reqData.repassword"
            autocomplete="off"
            placeholder="请再次输入密码"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="modifyUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import screenfull from "screenfull";
import api from "@/api/user";
import { getSession } from "@/utils/auth";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.reqData.newpassword !== "") {
          this.$refs.reqData.validateField("repassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.reqData.newpassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isFullscreen: false,   
      hideNav: false,
      username: JSON.parse(getSession("userInfo")).username,
      dialogVisible: false,
      reqData: {
        username: "",
        password: "",
        newpassword: "",
        repassword: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
        ],
        newpassword: [
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        repassword: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    screenfull() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "Your browser does not work",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle();
      this.isFullscreen = true;
    },

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
      this.$router.push("/login");
    },

    clearData() {
      this.reqData = {
        username: "",
        password: "",
        newpassword: "",
        repassword: "",
      };
    },

    showDialog() {
      this.clearData()
      this.dialogVisible = true;
    },

    closeDialog() {
      this.dialogVisible = false;
    },

    async modifyUser() {
      this.dialogVisible = false;
      const params = {
        id: JSON.parse(getSession("userInfo")).id,
        ...this.reqData,
      };
      const res = await this.$http.post(api.updateUser, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.logout();
      } else {
        this.$message.error(res.message);
      }
    },

    dropdownClick(command) {
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "modifyUser":
          this.showDialog();
          break;
        case "changeType":
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
  },
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