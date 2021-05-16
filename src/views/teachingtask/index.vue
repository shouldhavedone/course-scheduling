<template>
  <div class="task-container">
    <cheader title="教学任务管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-select
            v-model="selectSemester"
            clearable
            placeholder="请选择学期"
            class="select-box"
            @change="getTaskList"
          >
            <el-option
              v-for="item in semesterList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="selectMajor"
            clearable
            placeholder="请选择专业"
            class="select-box"
            @change="getTaskList"
          >
            <el-option
              v-for="item in majorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="addTask"
            >新增教学任务<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <!-- <el-button type="primary"
            >批量删除<i class="el-icon-delete-solid el-icon--right"></i
          ></el-button> -->
        </div>
      </div>

      <div class="table-wrap">
        <el-table
          :data="tableData"
          border
          row-key="id"
          style="width: 100%"
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
          <el-table-column prop="semester" label="学期" min-width="141">
            <template slot-scope="scope">
              {{ scope.row.Semester.name }}
            </template>
          </el-table-column>
          <el-table-column prop="major" label="专业" min-width="141">
            <template slot-scope="scope">
              {{ scope.row.Major.name }}
            </template>
          </el-table-column>
          <el-table-column prop="course" label="课程数量" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.Courses.length }}
            </template>
          </el-table-column>
          <el-table-column prop="credit" label="学分" min-width="80">
          </el-table-column>
          <el-table-column prop="total_hours" label="总学时" min-width="80">
          </el-table-column>
          <el-table-column
            prop="createtime"
            label="创建时间"
            sortable="custom"
            align="left"
            :min-width="180"
          ></el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="editTask(scope.row.id)" type="text" size="small"
                >详情</el-button
              >
              <el-button type="text" size="small" @click="delTask(scope.row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pageparams-wrap">
        <cpagenation
          :pageparams="pageparams"
          @handlePage="handlePage"
        ></cpagenation>
      </div>
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
      loading: false,
      tableData: [],
      tableSettings: {
        page: 1,
        rows: 12,
        isMultiple: false,
        // isSaveSelect: true,
        operateBtns: [
          { id: 1, btnName: "编辑" },
          { id: 3, btnName: "删除" },
        ],
      },
      pageparams: {
        pageSize: 12,
        total: 0,
        page: 1,
      },
      searchName: "",

      semesterList: [],
      selectSemester: "",
      majorList: [],
      selectMajor: "",
    };
  },

  mounted() {
    this.getSemesterList();
    this.getMajorList();
    this.getTaskList();
  },

  methods: {
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

    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getTaskList();
    },

    cancelSave() {
      this.getTaskList();
      this.resetDialog();
    },

    addTask() {
      // this.isEdit = false;
      // this.dialogVisible = true;
      this.$router.push("/task/detail");
    },

    async getTaskList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        // name: this.searchName,
        semester_id: this.selectSemester,
        major_id: this.selectMajor,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getTaskList}?${this.$qs.stringify(params)}`
      );
      this.loading = false;
      if (res && res.isSucceed) {
        res.data.forEach((c) => {
          c.createtime = this.$moment(new Date(c.createtime)).format(
            "YYYY-MM-DD hh:mm:ss"
          );
          c.count = c.Courses ? c.Courses.length : 0;
        });
        this.tableData = res.data;
        this.pageparams.total = res.total;
      }
    },

    async delTask(id) {
      const params = {
        id,
      };
      const res = await this.$http.post(api.delTask, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
      }
      this.$nextTick(() => {
        this.getTaskList();
      });
    },

    async editTask(id) {
      this.$router.push({
        path: "/task/detail",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;

.task-container {
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