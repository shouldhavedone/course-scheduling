<template>
  <div class="class-container">
    <cheader title="班级管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入班级名"
            v-model="searchName"
            class="input-with-select"
            @change="getClassList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-select
            v-model="selectMajor"
            clearable
            placeholder="请选择专业"
            @change="getClassList"
            class="select-box"
          >
            <el-option
              v-for="item in majorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addClass"
            >新增班级<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delClass"
            >批量删除<i class="el-icon-delete-solid el-icon--right"></i
          ></el-button>
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
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column prop="id" label="编号" min-width="80">
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="140">
          </el-table-column>
          <el-table-column prop="count" label="班级人数" min-width="100">
          </el-table-column>
          <el-table-column prop="grade" label="年级" min-width="100">
          </el-table-column>
          <el-table-column prop="major" label="专业" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.Major.name }}
            </template>
          </el-table-column>
          <el-table-column prop="schoolyear" label="学年" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.Schoolyear.name }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="createtime"
            label="创建时间"
            sortable="custom"
            align="left"
            :min-width="180"
          ></el-table-column> -->
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button @click="showDetail(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="delClass(scope.row.id)"
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

    <el-dialog
      :title="isEdit ? '编辑班级' : '新增班级'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="班级ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="班级名">
          <el-input
            v-model="reqData.name"
            placeholder="请输入班级名"
          ></el-input>
        </el-form-item>
        <el-form-item label="专业">
          <el-select
            v-model="reqData.major_id"
            clearable
            placeholder="请选择专业"
          >
            <el-option
              v-for="item in majorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级人数">
          <el-input-number v-model="reqData.count" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="年级">
          <el-select
            v-model="reqData.grade"
            clearable
            placeholder="请选择年级"
          >
            <el-option
              v-for="(item, index) in gradeList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年">
          <el-select
            v-model="reqData.schoolyear_id"
            clearable
            placeholder="请选择学年"
          >
            <el-option
              v-for="item in schoolyearList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/class";

export default {
  components: {
    cheader,
    ctable,
    cpagenation,
  },

  data() {
    return {
      loading: false,
      tableData: [],
      tableSettings: {
        page: 1,
        rows: 12,
      },
      pageparams: {
        pageSize: 12,
        total: 0,
        page: 1,
      },
      searchName: "",
      selectMajor: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        count: 1,
        grade: '',
        major_id: "",
        schoolyear_id: "",
        // createtime: "",
      },
      isEdit: false,
      selectClass: [],
      majorList: [],
      schoolyearList: [],
      gradeList: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
    };
  },

  mounted() {
    this.getClassList();
    this.getMajorList();
    this.getSchoolyearList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getClassList();
    },

    handleSelectionChange(val) {
      this.selectClass = val.map((c) => c.id);
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
      this.getClassList();
      this.resetDialog();
    },

    addClass() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        count: 1,
        count: '',
        major_id: "",
      };
    },

    async getMajorList() {
      const res = await this.$http.get(api.getAllMajor);
      if (res && res.isSucceed) {
        this.majorList = res.data;
      }
    },

    async getClassList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
        major_id: this.selectMajor,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getClassList}?${this.$qs.stringify(params)}`
      );
      this.loading = false;
      if (res && res.isSucceed) {
        // res.data.forEach((c) => {
        //   c.createtime = this.$moment(new Date(c.createtime)).format(
        //     "YYYY-MM-DD hh:mm:ss"
        //   );
        // });
        this.tableData = res.data;
        this.pageparams.total = res.total;
      }
    },

    async getSchoolyearList() {
      const res = await this.$http.get(api.getSchoolyearList);
      if (res && res.isSucceed) {
        this.schoolyearList = res.data;
      }
    },

    async saveClass() {
      const params = {
        ...this.reqData,
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateClass, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getClassList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delClass(id) {
      id ? this.selectClass.push(id) : "";
      const params = {
        ids: this.selectClass.join(","),
      };
      const res = await this.$http.post(api.delClass, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectClass = [];
        this.$nextTick(() => {
          this.getClassList();
        });
      }
    },
  },
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