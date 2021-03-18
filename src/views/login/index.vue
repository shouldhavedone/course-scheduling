<template>
  <div class="login-content">
    <div class="login-form">
      <div class="right-from">
        <p class="title">管理员登录</p>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="login-ruleForm"
          label-position="left"
          :hide-required-asterisk="false"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="ruleForm.username"
              placeholder="请输入您的账号"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入密码"
              @keyup.enter.native="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <div class="operate-box">
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              class="submit-btn"
              round
              >登录</el-button
            >
          </div>
        </el-form>
      </div>
    </div>
    <footer>
      <p>Copyright© 2020-2020 wutao All Rights Reserved.</p>
    </footer>
  </div>
</template>
<script>
import api from "@/api/index.js";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
        grant_type: "password",
      },
      rules: {
        username: [
          { required: true, message: "请输入您的账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return false;
        let res = await this.$http.post(
          api.getToken,
          this.$qs.stringify(this.ruleForm)
        );
        if (res && res.isSucceed) {
          this.$store.commit(
            "SET_TOKEN",
            res.data.token_type + " " + res.data.access_token
          );
          this.$store.commit("SET_USER", res.data.userInfo);
          this.$router.push("/");
        } else {
          this.$message.error(res.message);
          this.$store.commit("SET_TOKEN", null);
          this.$store.commit("SET_USER", "");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@width: 100vw/1920px;
@height: 100vh/960px;
@loginHeight: 160px * @height;
.logo-container {
  position: fixed;
  top: 32px * @height;
  left: 40px * @width;
}
.login-content {
  width: 100%;
  height: 100%;
  padding-top: 166px * @height;
  .login-form {
    box-shadow: 0px 0px 33px 10px rgba(0, 0, 0, 0.15);
    width: 30%;
    height: calc(100% - @loginHeight);
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }

  .right-from {
    position: relative;
    width: 80%;
    padding: 130px * @height 7%;
    text-align: center;
    .title {
      font-size: 24px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 24px;
      margin-bottom: 24px * @height;
    }
    .operate-box {
      display: flex;
      align-items: center;
      height: 32px;
      line-height: 32px;
      .submit-btn {
        width: 100%;
        margin-right: 16px;
        height: 40px * @height;
        border: none;
        font-size: 16px * @width;
      }
      .toReigster-btn {
        margin-bottom: 10px;
        margin-top: 10px;
        text-align: right;
        font-size: 12px;
        span {
          text-decoration: underline;
          color: #2878ff;
          cursor: pointer;
        }
      }
    }

    .getCode-btn {
      position: absolute;
      top: 22px;
      right: 10px;
      z-index: 99;
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(40, 120, 255, 1);
      width: 60px;
      text-align: center;
    }
  }
}

& > .el-form-item {
  margin-bottom: 10px * @height;
}

footer {
  // margin-top:30px* @height;
  height: 90px * @height;
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 35px * @height;
  p {
    margin: auto;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 24px;
  }
}
</style>
