<template>
  <div class="empty-container">
    <cheader title="空教室查询"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-date-picker
            v-model="selectDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <el-select v-model="selectBuilding" clearable placeholder="请选择教学楼" class="select-box">
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="selectTime" clearable placeholder="请选择节次" class="select-box">
            <el-option v-for="(item, index) in timeList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div class="btn-wrap">
          <el-button type="primary">查询<i class="el-icon-search el-icon--right"></i></el-button>
          <el-button type="primary">清空<i class="el-icon-delete-solid el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="table-wrap">
        <div class="floor-item">
          <div class="floor-title">1楼</div>
          <div>
            <span class="floor-name">1-101</span>
            <span class="floor-name">1-104</span>
            <span class="floor-name">1-105</span>
            <span class="floor-name">1-108</span>
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">2楼</div>
          <div>
            <span class="floor-name">1-202</span>
            <span class="floor-name">1-205</span>
            <span class="floor-name">1-206</span>
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">3楼</div>
          <div>
            <span class="floor-name">1-307</span>
            <span class="floor-name">1-310</span>
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">4楼</div>
          <div>
            <span class="floor-name">1-403</span>
            <span class="floor-name">1-408</span>
            <span class="floor-name">1-410</span>
            <span class="floor-name">1-411</span>
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">5楼</div>
          <div>
            <span class="floor-name">1-501</span>
            <span class="floor-name">1-502</span>
            <span class="floor-name">1-502</span>
            <span class="floor-name">1-505</span>
            <span class="floor-name">1-506</span>
            <span class="floor-name">1-509</span>
            <span class="floor-name">1-512</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cheader from "@/components/header";
import api from "@/api/schedule";

export default {
  components: {
    cheader,
  },
  data() {
    return {
      buildingList: '',
      buildingList: [],
      selectDate: '',
      selectBuilding: "",
      selectTime: "",
      timeList: ['一','二','三','四','五'],
    }
  },

  mounted() {
    this.getBuildingList();
  },

  methods: {
    async getBuildingList() {
      const res = await this.$http.get(api.getAllBuilding);
      if (res && res.isSucceed) {
        this.buildingList = res.data;
      }
    },
  }

}
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;

.empty-container {
  height: 100%;
  width: 100%;

  .content-wrap {
    height: calc(100% - @height1);
    width: 100%;
    position: relative;

    .filter-wrap {
      display: flex;
      // justify-content: space-between;
      margin: 10px * @height 0 16px * @height;

      .search-wrap {
        width: none;
        display: flex;
        align-items: center;
        margin-right: 32px * @width;

        .select-box {
          margin-left: 16px * @width;
          width: 300px * @width;
        }
      }
    }

    .table-wrap {
      width: 100%;

      &>div:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }

      .floor-item {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;

        &>div:last-child {
          display: flex;
          flex-flow: wrap;
          flex: 1;
        }
      }

      .floor-title {
        width: 54px;
        font-size: 20px;
        border-right: 4px solid #ccc;
        margin-right: 20px;
      }

      .floor-name {
        display: inline-block;
        line-height: 32px;
        width: 72px;
        font-size: 16px;
        border: 1px solid #ccc;
        text-align: center;
        margin: 6px;
        border-radius: 10px;
      }
    }
  }
}
</style>