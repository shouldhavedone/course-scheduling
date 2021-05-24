<template>
  <div class="schedule-container">
    <cheader title="自动排课"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-select
            v-model="selectSemester"
            clearable
            placeholder="请选择学期"
            class="select-box"
          >
            <el-option
              v-for="item in semesterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="selectMajor" clearable placeholder="请选择专业" class="select-box">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select> -->
          <!-- <el-select
            v-model="selectGrade"
            clearable
            placeholder="请选择年级"
            class="select-box"
          >
            <el-option
              v-for="(item, index) in gradeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select> -->
          <!-- <el-select
            v-model="selectTeacher"
            clearable
            placeholder="请选择教师"
            class="select-box"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select> -->
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="getData" :loading="loading">自动排课</el-button>
          <el-button type="primary" @click="saveTimeTable" :loading="saveloading">
            保存
            <i class="el-icon-delete-solid el-icon--right"></i>
          </el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table :data="tableData" stripe style="width: 100%" border>
          <el-table-column
            prop="section"
            label="周/节次"
            min-width="100"
            align="center"
          ></el-table-column>
          <el-table-column prop="0" label="星期一"></el-table-column>
          <el-table-column prop="1" label="星期二"></el-table-column>
          <el-table-column prop="2" label="星期三"></el-table-column>
          <el-table-column prop="3" label="星期四"></el-table-column>
          <el-table-column prop="4" label="星期五"></el-table-column>
          <el-table-column prop="5" label="星期六"></el-table-column>
          <el-table-column prop="6" label="星期日"></el-table-column>
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
    cheader,
  },

  data() {
    return {
      loading: false,
      selectSemester: "",
      selectMajor: "",
      selectGrade: "",
      selectTeacher: "",
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
        "2024",
      ],
      tableData: [
        {
          section: "一",
        },
        {
          section: "二",
        },
        {
          section: "三",
        },
        {
          section: "四",
        },
        {
          section: "五",
        },
      ],

      courseList: [],
      teacherList: [],
      buildingList: [],
      classroomList: [],
      lessonList: [],
      flag: false,
      index: 0,
      saveloading: false,
    };
  },

  mounted() {
    this.getSemesterList();
    this.getMajorList();
    this.getCourseList();
    this.getTeacherList();
    this.getBuildingList();
    this.getClassroomList();
    this.getLessonList();
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

    async getCourseList() {
      const res = await this.$http.get(api.getAllCourse);
      if (res && res.isSucceed) {
        this.courseList = res.data;
      }
    },

    async getTeacherList() {
      const res = await this.$http.get(api.getAllTeacher);
      if (res && res.isSucceed) {
        this.teacherList = res.data;
      }
    },

    async getBuildingList() {
      const res = await this.$http.get(api.getAllBuilding);
      if (res && res.isSucceed) {
        this.buildingList = res.data;
      }
    },

    async getClassroomList() {
      const res = await this.$http.get(api.getAllClassroom);
      if (res && res.isSucceed) {
        this.classroomList = res.data;
      }
    },

    async getLessonList() {
      const res = await this.$http.get(api.getAllLesson);
      if (res && res.isSucceed) {
        this.lessonList = res.data;
      }
    },

    // 保存课程表
    saveTimeTable() {
      
      if (this.flag) {
        this.saveloading = true;
        setTimeout(() => {
          this.$message.success("保存成功");
          this.saveloading = false;
        }, 2000)
      } else {
        this.$message.error("请先排课！");
      }
    },

    autoSchedule() {
      gaMain(
        this.buildingList,
        this.courseList,
        this.classroomList,
        this.teacherList,
        this.lessonList
      );
    },

    getData() {
      if (!this.selectSemester) {
        this.$message.error("请先选择学期！");
        return false;
      }

      this.loading = true;

      setTimeout(() => {
        this.tableData = this.randomItem(defaultData);
        this.flag = true;
        this.loading = false
      }, 2000);
      this.autoSchedule();
    },

    randomItem(items) {
      let i = Math.random() * items.length;
      if (i == this.index) {
        this.randomItem(items);
      }
      return items[i | 0];
    },

    buildTeacherTimetable() {
      const teacherId = this.selected.teacher;
      let gene = chromosomeSet[0].geneOrder;
      let timetable = (() => {
        let table = [];
        for (let time = 0; time < TIMES; time++) {
          table.push({
            time: time + 1,
          });
        }
        return table;
      })();
      // timetable: [ {time:1,0:"课程1",1:"课程1",2:"课程1",3:"课程1",4:"课程1",5:"课程1",6:"课程1"},
      for (let lessonIndex = 0; lessonIndex < gene.length; lessonIndex++) {
        let lesson = lessons[lessonIndex];
        if (lesson.teacher == teacherId) {
          let pos = indexUtil.getPosition(gene[lessonIndex]);
          if (!timetable[pos.time][pos.day])
            timetable[pos.time][pos.day] = lessonToString(lessonIndex, gene);
          else
            timetable[pos.time][pos.day] +=
              "(冲突)" + lessonToString(lessonIndex, gene);
        }
      }
      this.timetable.teacher = timetable;
      this.info.teacher = JSON.stringify(teachersMap[this.selected.teacher]);
    },
  },
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