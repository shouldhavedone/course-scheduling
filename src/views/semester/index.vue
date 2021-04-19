<template>
  <div class="semester-container">
    <cheader title="学期管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入学期名"
            v-model="searchName"
            class="input-with-select"
            @change="getSemesterList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-select
            v-model="selectSchoolyear"
            clearable
            placeholder="请选择学年"
            @change="getSemesterList"
            class="select-box"
          >
            <el-option
              v-for="item in schoolyearList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addSemester"
            >新增学期<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delSemester"
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
          <el-table-column prop="week_count" label="开课周数" min-width="80">
          </el-table-column>
          <el-table-column prop="start" label="开始时间" min-width="140">
          </el-table-column>
          <el-table-column prop="end" label="结束时间" min-width="140">
          </el-table-column>
          <el-table-column prop="schoolyear" label="学年" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.Schoolyear.name }}
            </template>
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
              <el-button @click="showDetail(scope.row)" type="text" size="small"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="delSemester(scope.row.id)"
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
      :title="isEdit ? '编辑学期' : '新增学期'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="学期ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="学期名">
          <el-input
            v-model="reqData.name"
            placeholder="请输入学期名"
          ></el-input>
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
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="reqData.time"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="开课周数">
          <el-input-number
            controls-position="right"
            v-model="reqData.week_count"
            label="描述文字"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveSemester">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/semester";

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
      selectSchoolyear: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        time: "",
        schoolyear_id: "",
        week_count: 20,
        createtime: "",
      },
      isEdit: false,
      selectSemester: [],
      schoolyearList: [],
    };
  },

  mounted() {
    this.getSemesterList();
    this.getSchoolyearList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getSemesterList();
    },

    handleSelectionChange(val) {
      this.selectSemester = val.map((c) => c.id);
    },

    showDetail(obj) {
      this.resetDialog();
      this.isEdit = true;
      this.dialogVisible = true;
      let time = [obj.start, obj.end];
      let temp = {
        ...obj,
        time,
      }
      this.reqData = temp;
    },

    cancelSave() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.getSemesterList();
      this.resetDialog();
    },

    addSemester() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        time: "",
        week_count: 20,
        schoolyear_id: "",
      };
    },

    async getSchoolyearList() {
      const res = await this.$http.get(api.getAllSchoolyear);
      if (res && res.isSucceed) {
        this.schoolyearList = res.data;
      }
    },

    async getSemesterList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
        schoolyear_id: this.selectSchoolyear,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getSemesterList}?${this.$qs.stringify(params)}`
      );
      this.loading = false;
      if (res && res.isSucceed) {
        res.data.forEach((c) => {
          c.createtime = this.$moment(new Date(c.createtime)).format(
            "YYYY-MM-DD hh:mm:ss"
          );
        });
        this.tableData = res.data;
        this.pageparams.total = res.total;
      }
    },

    async saveSemester() {
      const params = {
        ...this.reqData,
        start: this.reqData.time[0],
        end: this.reqData.time[1],
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateSemester, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getSemesterList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delSemester(id) {
      id ? this.selectSemester.push(id) : "";
      const params = {
        ids: this.selectSemester.join(","),
      };
      const res = await this.$http.post(api.delSemester, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectSemester = [];
        this.$nextTick(() => {
          this.getSemesterList();
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

.semester-container {
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

    .el-date-editor--monthrange.el-input, .el-date-editor--monthrange.el-input__inner {
      width: 500px * @width;
    }
  }
}
</style>