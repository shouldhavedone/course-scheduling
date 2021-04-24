<template>
  <div class="class-container">
    <cheader title="学生管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="select-wrap">
          <el-input
            placeholder="请输入学生名"
            v-model="searchName"
            class="input-with-select"
            @change="getStudentList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="search-wrap">
          <el-select
            v-model="selectClass"
            clearable
            placeholder="请选择班级"
            @change="getStudentList"
            class="select-box"
          >
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select
            v-model="selectMajor"
            clearable
            placeholder="请选择专业"
            @change="getStudentList"
            class="select-box"
          >
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select
            v-model="selectSchoolyear"
            clearable
            placeholder="请选择学年"
            @change="getStudentList"
            class="select-box"
          >
            <el-option
              v-for="item in schoolyearList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="selectGrade"
            clearable
            placeholder="请选择年级"
            @change="getStudentList"
            class="select-box"
          >
            <el-option
              v-for="(item, index) in gradeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addStudent">
            新增学生
            <i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <el-button type="primary" @click="delStudent">
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
          <el-table-column prop="id" label="编号" min-width="80"></el-table-column>
          <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
          <el-table-column prop="class" label="班级" min-width="140">
            <template slot-scope="scope">{{ scope.row.Class.name }}</template>
          </el-table-column>
          <el-table-column prop="major" label="专业" min-width="140">
            <template slot-scope="scope">{{ scope.row.Major.name }}</template>
          </el-table-column>
          <el-table-column prop="grade" label="年级" min-width="100"></el-table-column>
          <el-table-column prop="schoolyear" label="学年" min-width="140">
            <template slot-scope="scope">{{ scope.row.Schoolyear.name }}</template>
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
              <el-button @click="showDetail(scope.row)" type="text" size="small">编辑</el-button>
              <el-button type="text" size="small" @click="delStudent(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pageparams-wrap">
        <cpagenation :pageparams="pageparams" @handlePage="handlePage"></cpagenation>
      </div>
    </div>

    <el-dialog :title="isEdit ? '编辑学生' : '新增学生'" :visible.sync="dialogVisible">
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="学生ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="学生名">
          <el-input v-model="reqData.name" placeholder="请输入学生名"></el-input>
        </el-form-item>
        <el-form-item label="所属专业">
          <el-select v-model="reqData.major_id" clearable placeholder="请选择专业">
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属班级">
          <el-select v-model="reqData.class_id" clearable placeholder="请选择班级">
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="reqData.grade" clearable placeholder="请选择年级">
            <el-option v-for="(item, index) in gradeList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="reqData.schoolyear_id" clearable placeholder="请选择学年">
            <el-option
              v-for="item in schoolyearList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveStudent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/people";

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
      selectClass: "",
      selectMajor: "",
      selectSchoolyear: "",
      selectGrade: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        class_id: "",
        major_id: "",
        schoolyear_id: "",
        grade: '',
      },
      isEdit: false,
      selectStudent: [],
      classList: [],
      majorList: [],
      schoolyearList: [],
      gradeList: [
        "2017",
        "2018",
        "2019",
        "2020",
        "2021",
        "2022",
        "2023",
        "2024"
      ]
    };
  },

  mounted() {
    this.getStudentList();
    this.getClassList();
    this.getMajorList();
    this.getSchoolyearList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getStudentList();
    },

    handleSelectionChange(val) {
      this.selectStudent = val.map(c => c.id);
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
      this.getStudentList();
      this.resetDialog();
    },

    addStudent() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        class_id: "",
        major_id: "",
        schoolyear_id: "",
        grade: '',
      };
    },

    async getClassList() {
      const res = await this.$http.get(api.getAllClass);
      if (res && res.isSucceed) {
        this.classList = res.data;
      }
    },
    async getMajorList() {
      const res = await this.$http.get(api.getAllMajor);
      if (res && res.isSucceed) {
        this.majorList = res.data;
      }
    },
    async getSchoolyearList() {
      const res = await this.$http.get(api.getAllSchoolyear);
      if (res && res.isSucceed) {
        this.schoolyearList = res.data;
      }
    },

    async getStudentList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
        class_id: this.selectClass,
        major_id: this.selectMajor,
        schoolyear_id: this.selectSchoolyear,
        grade: this.selectGrade,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getStudentList}?${this.$qs.stringify(params)}`
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

    async saveStudent() {
      const params = {
        ...this.reqData,
        createtime: new Date()
      };
      const res = await this.$http.post(api.addOrUpdateStudent, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getStudentList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delStudent(id) {
      id ? this.selectStudent.push(id) : "";
      const params = {
        ids: this.selectStudent.join(",")
      };
      const res = await this.$http.post(api.delStudent, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectStudent = [];
        this.$nextTick(() => {
          this.getStudentList();
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

.class-container {
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

      .select-wrap {
        width: 400px * @width;
      }

      .search-wrap {
        width: 920px * @width;
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