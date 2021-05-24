<template>
  <div class="schedule-container">
    <cheader title="排课记录"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-select v-model="selectSemester" clearable placeholder="请选择学期" class="select-box">
            <el-option
              v-for="item in semesterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="selectMajor" clearable placeholder="请选择专业" class="select-box">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="selectGrade" clearable placeholder="请选择班级" class="select-box">
            <el-option v-for="(item, index) in gradeList" :key="index" :label="item" :value="item"></el-option>
          </el-select> -->
        </div>
        <div class="btn-wrap">
          <el-button type="primary" :loading="loading" @click="getData">查询<i class="el-icon-search el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column
            prop="section"
            label="周/节次"
            min-width="100"
            align="center"
          ></el-table-column>
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

import { gaMain, lessonToString, roomToString } from "@/utils/schedule";

export default {
  components: {
    cheader
  },

  data() {
    return {
      loading: false,
      selectSemester: "",
      selectMajor: "",
      selectGrade: "",
      semesterList: [],
      majorList: [],
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
      tableData: [
        {
          section: "一",
          one: {
            course: "高等数学",
            teacher: "张三",
            room: "2-102",
            count: 50,
            teachClass: 156,
            hour: 2
          },
          two: {},
          three: {},
          four: {
            course: "高等数学",
            teacher: "张三",
            room: "2-102",
            count: 50,
            teachClass: "321",
            hour: 2
          },
          five: {},
          six: {},
          seven: {}
        },
        {
          section: "二",
          one: {},
          two: {},
          three: {},
          four: {},
          five: {
            course: "高等数学",
            teacher: "张三",
            room: "2-102",
            count: 50,
            teachClass: "321",
            hour: 2
          },
          six: {},
          seven: {}
        },
        {
          section: "三",
          one: {},
          two: {
            course: "高等数学",
            teacher: "张三",
            room: "2-102",
            count: 50,
            teachClass: "321",
            hour: 2
          },
          three: {},
          four: {},
          five: {},
          six: {},
          seven: {}
        },
        {
          section: "四",
          one: {
            course: "高等数学",
            teacher: "张三",
            room: "2-102",
            count: 50,
            teachClass: "321",
            hour: 2
          },
          two: {},
          three: {},
          four: {},
          five: {},
          six: {},
          seven: {}
        },
        {
          section: "五",
          one: {},
          two: {},
          three: {},
          four: {},
          five: {},
          six: {},
          seven: {}
        }
      ]
    };
  },

  mounted() {
    this.getSemesterList();
    this.getMajorList();
  },

  methods: {
    async getSemesterList() {
      const res = await this.$http.get(api.getAllSemester);
      if (res && res.isSucceed) {
        this.semesterList = res.data;
      }
    },

    async getMajorList() {
      const res = await this.$http.get(api.getAllMajor);
      if (res && res.isSucceed) {
        this.majorList = res.data;
      }
    },

    getData() {
      if (!this.selectSemester) {
        this.$message.error("请先选择学期！");
        return false;
      }

      this.loading = true

      setTimeout(() => {
        this.tableData = this.randomItem(defaultData);
        this.loading = false
      }, 2000);
    },

    randomItem(items) {
      let i = Math.random() * items.length;
      if(i == this.index) {
        this.randomItem(items)
      }
      return items[i | 0];
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