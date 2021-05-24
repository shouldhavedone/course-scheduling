<template>
  <div class="menu-container">
    <cheader title="菜单管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入菜单名"
            v-model="searchName"
            class="input-with-select"
            @change="getMenuList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>

        <div class="btn-wrap">
          <el-button type="primary" @click="addMenu"
            >新增菜单<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delMenu"
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
          :tree-props="{children: 'Menus', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            :reserve-selection="true"
          >
          </el-table-column>
          <!-- <el-table-column prop="id" label="编号" min-width="80">
          </el-table-column> -->
          <el-table-column prop="name" label="名称" min-width="100">
          </el-table-column>
          <el-table-column prop="path" label="路由" min-width="100">
          </el-table-column>
          <el-table-column prop="icon" label="图标" min-width="80">
            <template slot-scope="scope">
              <i class="iconfont icon" :class="scope.row.icon"></i>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="role" label="所属账户" min-width="100">
            <template slot-scope="scope">{{scope.row.Role.name}}</template>
          </el-table-column> -->
          <el-table-column prop="sort" label="顺序" min-width="50">
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
              <el-button type="text" size="small" @click="delMenu(scope.row.id)"
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
      :title="isEdit ? '编辑菜单' : '新增菜单'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="菜单ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="菜单名">
          <el-input
            v-model="reqData.name"
            placeholder="请输入菜单名"
          ></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input
            v-model="reqData.icon"
            placeholder="请输入菜单图标"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input
            v-model="reqData.path"
            placeholder="请输入菜单路径"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户">
          <el-select
            v-model="reqData.role_id"
            clearable
            placeholder="请选择上级菜单"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select
            v-model="reqData.parent"
            clearable
            placeholder="请选择上级菜单"
          >
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input-number
            v-model="reqData.sort"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/menu";

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
        icon: "",
        sort: 1,
        path: "",
        parent: null,
        role_id: "",
        createtime: "",
      },
      isEdit: false,
      selectMenu: [],
      roleList: [],
    };
  },

  mounted() {
    this.getMenuList();
    this.getRoleList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getMenuList();
    },

    handleSelectionChange(val) {
      this.selectMenu = val.map((c) => c.id);
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
      this.getMenuList();
      this.resetDialog();
    },

    addMenu() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        icon: "",
        sort: 1,
        path: "",
        parent: null,
        role_id: "",
        createtime: "",
      };
    },

    async getRoleList() {
      const res = await this.$http.get(api.getAllRole);
      if (res && res.isSucceed) {
        this.roleList = res.data;
      }
    },

    async getMenuList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName,
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getMenuList}?${this.$qs.stringify(params)}`
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

    async saveMenu() {
      const params = {
        ...this.reqData,
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateMenu, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getMenuList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delMenu(id) {
      id ? this.selectMenu.push(id) : "";
      const params = {
        ids: this.selectMenu.join(","),
      };
      const res = await this.$http.post(api.delMenu, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectMenu = [];
        this.$nextTick(() => {
          this.getMenuList();
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

.menu-container {
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