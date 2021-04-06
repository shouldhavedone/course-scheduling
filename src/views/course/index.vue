<template>
  <div class="course-container">
    <cheader title="课程管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入课程名"
            v-model="searchName"
            class="input-with-select"
            @change="getCourseList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-select
            v-model="selectCourseType"
            clearable
            placeholder="请选择课程类型"
            @change="getCourseList"
            class="select-box"
          >
            <el-option
              v-for="item in courseTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addCourse">
            新增课程
            <i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <el-button type="primary" @click="delCourse">
            批量删除
            <i class="el-icon-delete-solid el-icon--right"></i>
          </el-button>
        </div>
      </div>

      <div class="table-wrap">
        <el-table
          :data="tableData"
          border
          row-key="id"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="Loading"
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column width="50" align="center">
            <template slot-scope="scope">
              <div>
                {{
                scope.$index +
                1 +
                (tableSettings.page - 1) * tableSettings.rows
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
          <el-table-column prop="name" label="名称" min-width="140"></el-table-column>
          <el-table-column prop="courseType" label="课程类型" min-width="140">
            <template slot-scope="scope">{{ scope.row.CourseType.name }}</template>
          </el-table-column>
          <el-table-column prop="credit" label="学分" min-width="80"></el-table-column>
          <el-table-column prop="class_hours" label="学时" min-width="80"></el-table-column>
          <el-table-column
            prop="createtime"
            label="创建时间"
            sortable="custom"
            align="left"
            :min-width="180"
          ></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="delCourse(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pageparams-wrap">
        <cpagenation :pageparams="pageparams" @handlePage="handlePage"></cpagenation>
      </div>
    </div>

    <el-dialog :title="isEdit ? '编辑课程' : '新增课程'" :visible.sync="dialogVisible">
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="课程ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="reqData.name" placeholder="请输入课程名"></el-input>
        </el-form-item>
        <el-form-item label="课程类型">
          <el-select v-model="reqData.course_type_id" clearable placeholder="请选择课程类型">
            <el-option
              v-for="item in courseTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学时">
          <el-input v-model="reqData.class_hours" placeholder="请输入课程学时"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="reqData.credit" placeholder="请输入课程学分"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveCourse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/course";

export default {
  components: {
    cheader,
    ctable,
    cpagenation
  },

  data() {
    return {
      loading: false,
      tableData: [],
      tableSettings: {
        page: 1,
        rows: 12
      },
      pageparams: {
        pageSize: 12,
        total: 0,
        page: 1
      },
      searchName: "",
      selectCourseType: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        course_type_id: "",
        createtime: "",
        credit: 0,
        class_hours: 0,
      },
      isEdit: false,
      selectCourse: [],
      courseTypeList: []
    };
  },

  mounted() {
    this.getCourseList();
    this.getCourseTypeList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getCourseList();
    },

    handleSelectionChange(val) {
      this.selectCourse = val.map(c => c.id);
    },

    showDetail(obj) {
      this.resetDialog();
      this.isEdit = true;
      this.dialogVisible = true;
      this.reqData = obj;
    },

    cancelSave() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.getCourseList();
      this.resetDialog();
    },

    addCourse() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        course_type_id: "",
        credit: 0,
        class_hours: 0,
      };
    },

    async getCourseTypeList() {
      const res = await this.$http.get(api.getAllCourseType);
      if (res && res.isSucceed) {
        this.courseTypeList = res.data;
      }
    },

    async getCourseList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
        course_type_id: this.selectCourseType
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getCourseList}?${this.$qs.stringify(params)}`
      );
      this.loading = false;
      if (res && res.isSucceed) {
        res.data.forEach(c => {
          c.createtime = this.$moment(new Date(c.createtime)).format(
            "YYYY-MM-DD hh:mm:ss"
          );
        });
        this.tableData = res.data;
        this.pageparams.total = res.total;
      }
    },

    async saveCourse() {
      const params = {
        ...this.reqData,
        createtime: new Date()
      };
      const res = await this.$http.post(api.addOrUpdateCourse, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getCourseList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delCourse(id) {
      id ? this.selectCourse.push(id) : "";
      const params = {
        ids: this.selectCourse.join(",")
      };
      const res = await this.$http.post(api.delCourse, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectCourse = [];
        this.$nextTick(() => {
          this.getCourseList();
        });
      }
    }
  }
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;

.course-container {
  height: 100%;
  width: 100%;

  .content-wrap {
    height: calc(100% - @height1);
    width: 100%;
    position: relative;

    .filter-wrap {
      display: flex;
      justify-content: space-between;
      margin: 10px * @height 0 16px * @height;

      .search-wrap {
        width: 640px * @width;
        display: flex;
        align-items: center;

        .select-box {
          margin-left: 16px * @width;
          width: 300px * @width;
        }
      }
    }

    .pageparams-wrap {
      width: 100%;
      height: 50px * @height;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  .el-dialog {
    width: 700px * @width;
  }
}
</style>