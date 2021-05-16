<template>
  <div class="tashDetail-container">
    <cheader :title="isEdit ? '编辑教学任务' : '新增教学任务'"></cheader>
    <div class="content-wrap">
      <div class="left-wrap">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="学期：" prop="semester">
            <el-select
              v-model="form.semester_id"
              placeholder="请选择学期"
              clearable
            >
              <el-option
                v-for="item in semesterList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业：" prop="major">
            <el-select
              v-model="form.major_id"
              placeholder="请选择专业"
              clearable
            >
              <el-option
                v-for="item in majorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="总学分：" prop="credit">
            <el-input
              v-model="form.credit"
              disabled
              clearable
              placeholder="请输入总学分"
            ></el-input>
          </el-form-item>
          <el-form-item label="总学时：" prop="total_hours">
            <el-input
              v-model="form.total_hours"
              disabled
              clearable
              placeholder="请输入总学时"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="right-wrap">
        <el-scrollbar>
          <el-table
            :data="courseList"
            row-key="id"
            style="width: 100%"
            ref='table'
            @selection-change="handleSelectionChange"
            v-loading="courseLoading"
            element-loading-text="Loading"
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              min-width="140"
            ></el-table-column>
            <el-table-column prop="courseType" label="课程类型" min-width="140">
              <template slot-scope="scope">{{
                scope.row.CourseType.name
              }}</template>
            </el-table-column>
            <el-table-column
              prop="credit"
              label="学分"
              min-width="80"
            ></el-table-column>
            <el-table-column
              prop="class_hours"
              label="学时"
              min-width="80"
            ></el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </div>

    <div class="footer-wrap">
      <el-button type="primary" @click="checkData">{{isEdit ? '保存' : '新增'}}教学计划</el-button>
      <el-button @click="goback">取消</el-button>
    </div>
  </div>
</template>
<script>
import cheader from "@/components/header";
import cpagenation from "@/components/pagenation";
import api from "@/api/task";

export default {
  components: {
    cheader,
    cpagenation,
  },
  data() {
    return {
      form: {
        id: "",
        major_id: "",
        semester_id: "",
        credit: "",
        total_hours: "",
      },
      semesterList: [],
      majorList: [],
      courseList: [],
      selectCourse: [],
      courseLoading: false,
      loading: false,
      rules: {
        semester: [
          { required: true, message: "请选择学期", trigger: "change" },
        ],
        major: [{ required: true, message: "请选择专业", trigger: "change" }],
        credit: [{ required: true, message: "请选择课程" }],
        total_hours: [{ required: true, message: "请选择课程" }],
      },
      isEdit: false,
    };
  },

  mounted() {
    this.getMajorList();
    this.getSemesterList();
    this.getCourseList();

    if (this.$route.query.id) {
      this.isEdit = true;
      this.getTaskDetail(this.$route.query.id);
    }
  },

  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.selectCourse = val;
      this.form.credit = val.length
        ? val.map((c) => c.credit).reduce((a, b) => a + b)
        : 0;
      this.form.total_hours = val.length
        ? val.map((c) => c.class_hours).reduce((a, b) => a + b)
        : 0;
    },

    async getMajorList() {
      const res = await this.$http.get(api.getAllMajor);
      if (res && res.isSucceed) {
        this.majorList = res.data;
      }
    },
    async getSemesterList() {
      const res = await this.$http.get(api.getAllSemester);
      if (res && res.isSucceed) {
        this.semesterList = res.data;
      }
    },

    async getCourseList() {
      this.courseLoading = true;
      const res = await this.$http.get(api.getAllCourse);
      if (res && res.isSucceed) {
        this.courseList = res.data;
      }
      this.courseLoading = false;
    },

    checkData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.saveTask();
        } else {
          return false;
        }
      });
    },

    async saveTask() {
      const params = {
        ...this.form,
        courseList: this.selectCourse.map((item) => item.id),
      };

      console.log(params)

      // const res = await this.$http.post(api.addOrUpdateTask, params);
      // if (res && res.isSucceed) {
      //   this.$message.success(res.message);
      //   this.goback();
      // }
    },

    goback() {
      this.$router.go(-1);
    },

    async getTaskDetail(id) {
      this.loading = true;
      const res = await this.$http.post(api.getTaskDetail, { id });
      if (res && res.isSucceed) {
        this.form = {
          ...res.data,
        };
        res.data.Courses.forEach((row) => {
          this.$refs.table.toggleRowSelection(row);
        });
      }
      this.loading = false;
    },
  },
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;
@height2: 60px * @height;

.tashDetail-container {
  width: 100%;
  height: 100%;

  .content-wrap {
    border-top: 1px solid #ccc;
    height: calc(100% - @height1);
    padding-top: 20px * @height;
    display: flex;

    & > div {
      flex: 1;
    }

    .left-wrap {
      margin-right: 10px * @width;
      border-right: 1px solid #ccc;
      padding: 0 16px * @width @height2;
    }

    .right-wrap {
      padding: 0 16px * @width;
      .el-scrollbar {
        height: 732px * @height;
      }

      & > div .course-item:not(:first-child) {
        border-top: 1px solid #eee;
      }
      .course-item {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;

        .item-left {
          height: 60px;
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            height: 16px;
            width: 16px;
          }
        }

        .item-right {
          display: flex;
          width: 100%;

          & > div {
            flex: 1;
          }

          & > div:first-child {
            // width: 240px;
            flex: 2;
          }
          // &>div:nth-child(2) {
          //   width: 160px;
          // }
        }
      }
    }
  }

  .el-select {
    width: 400px * @width;
  }

  .footer-wrap {
    height: @height2;
    width: 100%;
    border-top: 1px solid #ccc;
    // background-color: #000;
    background-color: #fff;
    position: relative;
    bottom: @height2;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>