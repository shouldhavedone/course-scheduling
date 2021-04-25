<template>
  <div class="schedule-container">
    <cheader title="查看课表"></cheader>
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
          <el-select v-model="selectGrade" clearable placeholder="请选择年级" class="select-box">
            <el-option v-for="(item, index) in gradeList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="selectMajor" clearable placeholder="请选择专业" class="select-box">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="selectClass" clearable placeholder="请选择班级" class="select-box">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="btn-wrap">
          <el-button type="primary">
            清空
            <i class="el-icon-delete-solid el-icon--right"></i>
          </el-button>
          <el-button type="primary">查询<i class="el-icon-search el-icon--right"></i></el-button>
        </div>
      </div>
      <div class="table-wrap">
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="section" label="周/节次" min-width="100" align="center"></el-table-column>
          <el-table-column label="星期一">
            <template slot-scope="scope">
              <div v-if="scope.row.one.course">课程名: {{ scope.row.one.course }}</div>
              <div v-if="scope.row.one.teacher">任课教师: {{ scope.row.one.teacher }}</div>
              <div v-if="scope.row.one.room">教室: {{ scope.row.one.room }}</div>
              <div v-if="scope.row.one.count">课程人数: {{ scope.row.one.count }}</div>
              <div v-if="scope.row.one.teachClass">课程班ID: {{ scope.row.one.teachClass }}</div>
              <div v-if="scope.row.one.hour">上课课时: {{ scope.row.one.hour }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星期二">
            <template slot-scope="scope">
              <div v-if="scope.row.two.course">课程名: {{ scope.row.two.course }}</div>
              <div v-if="scope.row.two.teacher">任课教师: {{ scope.row.two.teacher }}</div>
              <div v-if="scope.row.two.room">教室: {{ scope.row.two.room }}</div>
              <div v-if="scope.row.two.count">课程人数: {{ scope.row.two.count }}</div>
              <div v-if="scope.row.two.teachClass">课程班ID: {{ scope.row.two.teachClass }}</div>
              <div v-if="scope.row.two.hour">上课课时: {{ scope.row.two.hour }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星期三">
            <template slot-scope="scope">
              <div v-if="scope.row.three.course">课程名: {{ scope.row.three.course }}</div>
              <div v-if="scope.row.three.teacher">任课教师: {{ scope.row.three.teacher }}</div>
              <div v-if="scope.row.three.room">教室: {{ scope.row.three.room }}</div>
              <div v-if="scope.row.three.count">课程人数: {{ scope.row.three.count }}</div>
              <div v-if="scope.row.three.teachClass">课程班ID: {{ scope.row.three.teachClass }}</div>
              <div v-if="scope.row.three.hour">上课课时: {{ scope.row.three.hour }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星期四">
            <template slot-scope="scope">
              <div v-if="scope.row.four.course">课程名: {{ scope.row.four.course }}</div>
              <div v-if="scope.row.four.teacher">任课教师: {{ scope.row.four.teacher }}</div>
              <div v-if="scope.row.four.room">教室: {{ scope.row.four.room }}</div>
              <div v-if="scope.row.four.count">课程人数: {{ scope.row.four.count }}</div>
              <div v-if="scope.row.four.teachClass">课程班ID: {{ scope.row.four.teachClass }}</div>
              <div v-if="scope.row.four.hour">上课课时: {{ scope.row.four.hour }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星期五">
            <template slot-scope="scope">
              <div v-if="scope.row.five.course">课程名: {{ scope.row.five.course }}</div>
              <div v-if="scope.row.five.teacher">任课教师: {{ scope.row.five.teacher }}</div>
              <div v-if="scope.row.five.room">教室: {{ scope.row.five.room }}</div>
              <div v-if="scope.row.five.count">课程人数: {{ scope.row.five.count }}</div>
              <div v-if="scope.row.five.teachClass">课程班ID: {{ scope.row.five.teachClass }}</div>
              <div v-if="scope.row.five.hour">上课课时: {{ scope.row.five.hour }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星期六">
            <template slot-scope="scope">
              <div v-if="scope.row.six.course">课程名: {{ scope.row.six.course }}</div>
              <div v-if="scope.row.six.teacher">任课教师: {{ scope.row.six.teacher }}</div>
              <div v-if="scope.row.six.room">教室: {{ scope.row.six.room }}</div>
              <div v-if="scope.row.six.count">课程人数: {{ scope.row.six.count }}</div>
              <div v-if="scope.row.six.teachClass">课程班ID: {{ scope.row.six.teachClass }}</div>
              <div v-if="scope.row.six.hour">上课课时: {{ scope.row.six.hour }}</div>
            </template>
          </el-table-column>
          <el-table-column label="星期日">
            <template slot-scope="scope">
              <div v-if="scope.row.seven.course">课程名: {{ scope.row.seven.course }}</div>
              <div v-if="scope.row.seven.teacher">任课教师: {{ scope.row.seven.teacher }}</div>
              <div v-if="scope.row.seven.room">教室: {{ scope.row.seven.room }}</div>
              <div v-if="scope.row.seven.count">课程人数: {{ scope.row.seven.count }}</div>
              <div v-if="scope.row.seven.teachClass">课程班ID: {{ scope.row.seven.teachClass }}</div>
              <div v-if="scope.row.seven.hour">上课课时: {{ scope.row.seven.hour }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import cheader from "@/components/header";
import api from "@/api/schedule";

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
      selectClass: "",
      semesterList: [],
      classList: [],
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
          one: {},
          two: {
            course: "高等数学",
            teacher: "张三",
            room: "2-102",
            count: 50,
            teachClass: 156,
            hour: 2
          },
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
          section: "二",
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
          one: {},
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
    this.getClassList()
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

    async getClassList() {
      const res = await this.$http.get(api.getAllClass);
      if (res && res.isSucceed) {
        this.classList = res.data;
      }
    }
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