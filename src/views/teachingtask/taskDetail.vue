<template>
  <div class="tashDetail-container">
    <cheader :title="isEdit ? '编辑教学任务' : '新增教学任务'"></cheader>
    <div class="content-wrap">
      <div class="left-wrap">
        <el-scrollbar>
          <el-form
            ref="form"
            :model="form"
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
                @change="getClassByMajor"
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
          <el-button type="primary" @click="showDialog">添加课程</el-button>
        </el-scrollbar>
      </div>
      <div class="right-wrap">
        <el-scrollbar>
          <el-table
            :data="lessonClass"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="name" label="课程"> </el-table-column>
            <el-table-column prop="number" label="授课人数"> </el-table-column>
            <el-table-column prop="teacherName" label="授课教师">
            </el-table-column>
            <el-table-column prop="className" label="教学班级">
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </div>

    <div class="footer-wrap">
      <el-button type="primary" @click="checkData"
        >{{ isEdit ? "保存" : "新增" }}教学计划</el-button
      >
      <el-button @click="goback">取消</el-button>
    </div>

    <el-dialog title="添加课程" :visible.sync="dialogVisible" width="70%">
      <el-form
        ref="courseForm"
        :model="courseForm"
        :rules="courseRules"
        label-width="86px"
        label-position="left"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="课程：" prop="course">
              <el-select
                v-model="courseForm.course_id"
                placeholder="请选择课程"
                clearable
                @change="selectCourse"
              >
                <el-option
                  v-for="item in courseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学分：" prop="credit">
              <el-input-number
                v-model="courseForm.credit"
                controls-position="right"
                disabled
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="学时：" prop="hours">
              <el-input-number
                v-model="courseForm.hours"
                controls-position="right"
                disabled
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <template v-for="(item, index) in lessonData">
          <el-row :key="index">
            <el-col :span="8">
              <el-form-item label="授课教师：" prop="teacher">
                <el-select
                  v-model="item.teacher_id"
                  placeholder="请选择授课教师"
                  clearable
                  :disabled="teacherList.length ? false : true"
                  @change="selectTeacher(index)"
                >
                  <el-option
                    v-for="item in teacherList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="授课人数：">
                <el-input-number
                  :min="0"
                  v-model="item.number"
                  controls-position="right"
                  :disabled="teacherList.length ? false : true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="行政班级：">
                <el-select
                  v-model="item.class_id"
                  placeholder="请选择行政班级"
                  clearable
                  :disabled="teacherList.length ? false : true"
                  @change="selectClass(index)"
                >
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button @click.prevent="removeClass(item)">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLessonClass">新增教学班</el-button>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="sureDialog">确 定</el-button>
      </div>
    </el-dialog>
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
        credit: 0,
        total_hours: 0,
      },
      semesterList: [],
      majorList: [],
      courseList: [],
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
      dialogVisible: false,
      courseForm: {
        course_id: "",
        courseName: "",
        count: 1,
        credit: 0,
        hours: 0,
      },
      lessonData: [
        {
          teacher_id: "",
          teacherName: "",
          number: 0,
          class_id: "",
          className: "",
        },
      ],
      courseRules: {
        // course: [{ required: true, message: "请选择课程", trigger: "change" }],
        count: [
          { required: true, message: "请输入教学班数量", trigger: "blur" },
        ],
        credit: [
          {
            required: true,
            message: "请选择课程",
          },
        ],
        hours: [
          {
            required: true,
            message: "请选择课程",
          },
        ],
      },
      lessonClass: [],
      teacherList: [],
      classList: [],
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
    async getClassByMajor() {
      const params = {
        major_id: this.form.major_id,
      };

      const res = await this.$http.get(
        `${api.getClassByMajor}?${this.$qs.stringify(params)}`
      );

      if (res && res.isSucceed) {
        this.classList = res.data;
      }
    },

    removeClass(item) {
      var index = this.lessonData.indexOf(item);
      if (index !== -1) {
        this.lessonData.splice(index, 1);
      }
    },
    addLessonClass() {
      this.lessonData.push({
        teacher_id: "",
        teacherName: "",
        number: 0,
        class_id: "",
        className: "",
      });
    },

    showDialog() {
      this.resetData();
      this.dialogVisible = true;
    },

    sureDialog() {
      const arr = this.lessonData.map((item) => {
        return {
          course_id: this.courseForm.course_id,
          name: this.courseForm.courseName,
          ...item,
        };
      });

      this.lessonClass = [...this.lessonClass, ...arr];
      this.dialogVisible = false;
    },

    closeDialog() {
      this.dialogVisible = false;
      this.resetData();
    },

    resetData() {
      this.courseForm = {
        course_id: "",
        count: 1,
        credit: 0,
        hours: 0,
      };
      this.lessonData = [
        {
          teacher_id: "",
          teacherName: "",
          number: 0,
          class_id: "",
          className: "",
        },
      ];
    },

    selectCourse() {
      if (!this.courseForm.course_id) {
        this.courseForm = {
          credit: "",
          hours: 0,
          class_id: "",
          courseName: "",
        };
        this.lessonData = [
          {
            teacher: "",
            number: 0,
            class_id: "",
          },
        ];
        this.teacherList = [];
        return false;
      }
      const course = this.courseList.find(
        (item) => item.id == this.courseForm.course_id
      );
      this.courseForm = {
        ...this.courseForm,
        credit: course.credit,
        hours: course.class_hours,
        courseName: course.name,
      };

      this.getTeacherByCourse(this.courseForm.course_id);
    },

    selectTeacher(index) {
      const teacher = this.teacherList.find(
        (item) => item.id == this.lessonData[index].teacher_id
      );
      this.lessonData[index].teacherName = teacher.name;
    },
    selectClass(index) {
      let item = this.lessonData[index];

      console.log(item)
      let flag = false;

      for (let i = 0; i < this.lessonData.length - 1; i++) {
        console.log(this.lessonData[i])
        
        if (this.lessonData[i].class_id == item.class_id) {
          flag = true;
        }
      }

      if (flag) {
        this.$message.error("行政班级重复");

        return false;
      }

      const classItem = this.classList.find(
        (item) => item.id == this.lessonData[index].class_id
      );
      this.lessonData[index].className = classItem.name;
      this.lessonData[index].number = classItem.count;
    },

    async getTeacherByCourse(id) {
      const params = {
        course_id: id,
      };
      const res = await this.$http.get(
        `${api.getTeacherByCourse}?${this.$qs.stringify(params)}`
      );
      if (res && res.isSucceed) {
        this.teacherList = res.data;
      }
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
      const res = await this.$http.get(api.getAllCourse);
      if (res && res.isSucceed) {
        this.courseList = res.data;
      }
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
        lessonClass: this.lessonClass,
        // courseList: this.selectCourse.map((item) => item.id),
      };

      const res = await this.$http.post(api.addOrUpdateTask, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.goback();
      }
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
      }
      this.loading = false;
    },

    filterData(data) {},
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

    .el-select {
      width: 400px * @width;
    }
  }

  .el-dialog {
    .class-form-item .el-input {
      width: 50%;
    }

    .el-select {
      width: 300px * @width;
    }
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