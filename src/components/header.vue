<template>
  <div class="header-wrap">
    <div class="title">{{title}}</div>
    <div class="time">更新时间：{{ time }}</div>
  </div>
</template>
<script>
import { dateFormat } from "@/utils/auth.js";

export default {
  props: ['title'],
  data() {
    return {
      time: '',
    }
  },
  beforeMount() {
    this.time = dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss");
  },
};
</script>
<style lang="less">
@height: 100vh/960px;
@width: 100vw/1920px;

.header-wrap {
  height: 50px * @height;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 20px * @width;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #000000;
  }

  .time {
    font-size: 14px * @width;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #909399;
  }
}
</style>