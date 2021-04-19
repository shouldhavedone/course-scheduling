<template>
  <div class="user-container">
    <cheader title="用户管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入用户名"
            v-model="searchName"
            class="input-with-select"
            @change="getUserList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-select
            v-model="selectBuilding"
            clearable
            placeholder="请选择账户"
            @change="getUserList"
            class="select-box"
          >
            <el-option
              v-for="item in buildingList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addUser"
            >新增用户<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delUser"
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
          <el-table-column prop="username" label="名称" min-width="140">
          </el-table-column>
          <el-table-column prop="building" label="账户" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.Role.name }}
            </template>
          </el-table-column>
          <el-table-column prop="password" label="密码" min-width="140">
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
                @click="delUser(scope.row.id)"
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
      :title="isEdit ? '编辑用户' : '新增用户'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="用户ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="reqData.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-select
            v-model="reqData.role_id"
            clearable
            placeholder="请选择账户"
          >
            <el-option
              v-for="item in buildingList"
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
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/user";

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
        username: "",
        role_id: "",
        createtime: "",
      },
      isEdit: false,
      selectUser: [],
      buildingList: [],
    };
  },

  mounted() {
    this.getUserList();
    this.getRoleList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getUserList();
    },

    handleSelectionChange(val) {
      this.selectUser = val.map((c) => c.id);
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
      this.getUserList();
      this.resetDialog();
    },

    addUser() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        username: "",
        role_id: "",
      };
    },

    async getRoleList() {
      const res = await this.$http.get(api.getAllRole);
      if (res && res.isSucceed) {
        this.buildingList = res.data;
      }
    },

    async getUserList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        username: this.searchName,
        role_id: this.selectBuilding,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getUserList}?${this.$qs.stringify(params)}`
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

    async saveUser() {
      const params = {
        ...this.reqData,
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateUser, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getUserList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delUser(id) {
      id ? this.selectUser.push(id) : "";
      const params = {
        ids: this.selectUser.join(","),
      };
      const res = await this.$http.post(api.delUser, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectUser = [];
        this.$nextTick(() => {
          this.getUserList();
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

.user-container {
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