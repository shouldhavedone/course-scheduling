<template>
  <div class="role-container">
    <cheader title="账户管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入账户名"
            v-model="searchName"
            class="input-with-select"
            @change="getRoleList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addRole"
            >新增账户<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delRole"
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
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.Menus"
                :key="index"
                class="menu-item"
              >
                <i class="iconfont icon" :class="item.icon"></i>{{ item.name }}
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
          <el-table-column prop="role" label="账户" min-width="140">
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="140">
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
              <el-button type="text" size="small" @click="delRole(scope.row.id)"
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
      :title="isEdit ? '编辑账户' : '新增账户'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="账户ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-input v-model="reqData.role" placeholder="请输入账户"></el-input>
        </el-form-item>
        <el-form-item label="账户名">
          <el-input
            v-model="reqData.name"
            placeholder="请输入账户名"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/role";

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
      selectBuilding: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        role: "",
      },
      isEdit: false,
      selectRole: [],
      buildingList: [],
    };
  },

  mounted() {
    this.getRoleList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getRoleList();
    },

    handleSelectionChange(val) {
      this.selectRole = val.map((c) => c.id);
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
      this.getRoleList();
      this.resetDialog();
    },

    addRole() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        role: "",
      };
    },

    async getRoleList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getRoleList}?${this.$qs.stringify(params)}`
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

    async saveRole() {
      const params = {
        ...this.reqData,
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateRole, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getRoleList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delRole(id) {
      id ? this.selectRole.push(id) : "";
      const params = {
        ids: this.selectRole.join(","),
      };
      const res = await this.$http.post(api.delRole, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectRole = [];
        this.$nextTick(() => {
          this.getRoleList();
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

.role-container {
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

    .menu-item {
      font-size: 12px * @width;
      height: 20px * @height;
      line-height: 20px * @height;

      i {
        margin-right: 12px * @width;
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