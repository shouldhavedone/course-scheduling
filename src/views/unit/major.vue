<template>
  <div class="major-container">
    <cheader title="专业管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入专业名"
            v-model="searchName"
            class="input-with-select"
            @change="getMajorList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-select
            v-model="selectCollege"
            clearable
            placeholder="请选择学院"
            @change="getMajorList"
            class="select-box"
          >
            <el-option
              v-for="item in collegeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addMajor"
            >新增专业<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delMajor"
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
          <!-- <el-table-column prop="id" label="编号" min-width="80">
          </el-table-column> -->
          <el-table-column prop="name" label="名称" min-width="140">
          </el-table-column>
          <el-table-column prop="college" label="学院" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.College.name }}
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
                @click="delMajor(scope.row.id)"
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
      :title="isEdit ? '编辑专业' : '新增专业'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <!-- <el-form-item v-if="isEdit" label="专业ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="专业名">
          <el-input
            v-model="reqData.name"
            placeholder="请输入专业名"
          ></el-input>
        </el-form-item>
        <el-form-item label="学院">
          <el-select
            v-model="reqData.college_id"
            clearable
            placeholder="请选择学院"
          >
            <el-option
              v-for="item in collegeList"
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
        <el-button type="primary" @click="saveMajor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/major";

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
      selectCollege: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        college_id: "",
        createtime: "",
      },
      isEdit: false,
      selectMajor: [],
      collegeList: [],
    };
  },

  mounted() {
    this.getMajorList();
    this.getCollegeList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getMajorList();
    },

    handleSelectionChange(val) {
      this.selectMajor = val.map((c) => c.id);
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
      this.getMajorList();
      this.resetDialog();
    },

    addMajor() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        college_id: "",
      };
    },

    async getCollegeList() {
      const res = await this.$http.get(api.getAllCollege);
      if (res && res.isSucceed) {
        this.collegeList = res.data;
      }
    },

    async getMajorList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
        college_id: this.selectCollege,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getMajorList}?${this.$qs.stringify(params)}`
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

    async saveMajor() {
      const params = {
        ...this.reqData,
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateMajor, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getMajorList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delMajor(id) {
      id ? this.selectMajor.push(id) : "";
      const params = {
        ids: this.selectMajor.join(","),
      };
      const res = await this.$http.post(api.delMajor, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectMajor = [];
        this.$nextTick(() => {
          this.getMajorList();
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

.major-container {
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