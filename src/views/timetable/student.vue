<template>
  <div class="schedule-container">
    <cheader title="查看课表"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-select v-model="selectSemester" clearable placeholder="请选择学期" class="select-box">
            <el-option
              v-for="(item, index) in semesterList"
              :key="item.id"
              :label="item.name"
              :value="index"
            ></el-option>
          </el-select>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" :loading="loading" @click="getData">查询<i class="el-icon-search el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="section" label="周/节次" min-width="100" align="center"></el-table-column>
          <el-table-column label="星期一" prop="0"></el-table-column>
          <el-table-column label="星期二" prop="1"></el-table-column>
          <el-table-column label="星期三" prop="2"></el-table-column>
          <el-table-column label="星期四" prop="3"></el-table-column>
          <el-table-column label="星期五" prop="4"></el-table-column>
          <el-table-column label="星期六" prop="5"></el-table-column>
          <el-table-column label="星期日" prop="6"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import cheader from "@/components/header";
import api from "@/api/schedule";

import { timeTable, defaultData } from "@/utils/data";

export default {
  components: {
    cheader
  },

  data() {
    return {
      loading: false,
      selectSemester: null,
      selectCourse: "",
      selectGrade: "",
      semesterList: [],
      courseList: [],
      gradeList: [
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024"
      ],
      
      tableData: []
    };
  },

  mounted() {
    this.getSemesterList();
    this.getCourseList();
  },

  methods: {
    async getSemesterList() {
      const res = await this.$http.get(api.getAllSemester);
      if (res && res.isSucceed) {
        this.semesterList = res.data;
      }
    },

    async getCourseList() {
      const res = await this.$http.get(api.getAllCourse);
      if (res && res.isSucceed) {
        this.courseList = res.data;
      }
    },

    getData() {
      if(this.selectSemester == null) {
        this.$message.error('请先选择学期！')
        return false
      }
      this.loading = true
      setTimeout(() => {
        this.tableData = defaultData[this.selectSemester];
        this.loading = false;
      }, 2000)
    },

    randomItem(items) {
      return items[Math.random() * items.length | 0]
    },
  }
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;

.schedule-container {
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
  }
  .el-table .cell {
    font-size: 12px;
  }
}
</style>