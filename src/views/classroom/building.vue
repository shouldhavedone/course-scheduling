<template>
  <div class="building-container">
    <cheader title="教学楼管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入教学楼名"
            v-model="searchName"
            class="input-with-select"
            @change="getBuildingList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="addBuilding"
            >新增教学楼<i class="el-icon-plus el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="delBuilding"
            >批量删除<i class="el-icon-delete-solid el-icon--right"></i
          ></el-button>
        </div>
      </div>

      <div class="table-wrap">
        <ctable
          :data="tableData" 
          :cloumn="cloumn"
          :settings="tableSettings"
          @btnClick="showDetail"    
          @handleSelectionChange="handleSelectionChange"
          v-loading="loading"
          element-loading-text="Loading"
          element-loading-spinner="el-icon-loading"
        ></ctable>
      </div>

      <div class="pageparams-wrap">
        <cpagenation
          :pageparams="pageparams"
          @handlePage="handlePage"
        ></cpagenation>
      </div>
    </div>

    <el-dialog
      :title="isEdit ? '编辑教学楼' : '新增教学楼'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="教学楼ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="教学楼名">
          <el-input
            v-model="reqData.name"
            placeholder="请输入教学楼名"
          ></el-input>
        </el-form-item>
        <el-form-item label="楼层数">
          <el-input-number
            v-model="reqData.floor"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="面积">
          <el-input-number
            v-model="reqData.area"
            controls-position="right"
            :precision="2"
            :step="0.1"
            :min="1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveBuilding">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import cheader from "@/components/header";
import ctable from "@/components/table";
import cpagenation from "@/components/pagenation";
import api from "@/api/classroom";

export default {
  components: {
    cheader,
    ctable,
    cpagenation,
  },

  data() {
    return {
      loading: false, // 加载
      tableData: [], // 表格数据
      cloumn: [
        {
          prop: "id",
          label: "编号",
          minWidth: 80,
        },
        {
          prop: "name",
          label: "名称",
          minWidth: 141,
        },
        {
          prop: "area",
          label: "教学楼面积",
          minWidth: 141,
        },
        {
          prop: "floor",
          label: "楼层数",
          minWidth: 141,
        },
        {
          prop: "count",
          label: "教室数量",
          minWidth: 77,
        },
        {
          prop: "createtime",
          label: "创建时间",
          minWidth: 180,
        },
      ], // 表头数据
      tableSettings: {
        page: 1, // 页，1
        rows: 12, //
        isMultiple: true, // 多选框
        isSaveSelect: true, // 是否保存选项
        operateBtns: [
          { id: 1, btnName: "编辑" },
          { id: 3, btnName: "删除" },
        ],
      },
      pageparams: {
        pageSize: 12, //
        total: 0, // 总数据量
        page: 1, // 第几页
      }, //
      searchName: "", // 搜索值
      dialogVisible: false, // 显示弹窗
      reqData: {
        // 保存表单的值
        id: "",
        name: "",
        createtime: "", //
        floor: 1,
        area: 10,
      }, // 弹窗内容
      isEdit: false, // 是否
      selectBuilding: [],
    };
  },

  mounted() {
    this.getBuildingList();
  },

  methods: {
    async getBuildingList() {
      const params = {
        page: this.pageparams.page, // 页   1，
        rows: this.pageparams.pageSize, // 请求多少条数据   ，12
        name: this.searchName, //  搜索值
      };
      this.loading = true;
      const res = await this.$http.get(
        // 向后台发送请求，get请求 ，
        `${api.getBuildingList}?${this.$qs.stringify(params)}`
      );
      this.loading = false;
      if (res && res.isSucceed) {
        res.data.forEach((c) => {
          c.createtime = this.$moment(new Date(c.createtime)).format(
            "YYYY-MM-DD hh:mm:ss"
          );
          c.count = c.Classrooms ? c.Classrooms.length : 0;
        });
        this.tableData = res.data;
        this.pageparams.total = res.total;
      }
    },

    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getBuildingList();
    },

    handleSelectionChange(val) {
      this.selectBuilding = val.map((c) => c.id);
    },

    showDetail(obj) {
      if (obj.id == 1) {
        this.resetDialog();
        this.isEdit = true;
        this.dialogVisible = true;
        this.reqData = obj.row;
      } else {
        if (!this.selectBuilding) {
          this.$message.error("请选择项！");
          return;
        }
        this.selectBuilding = [obj.row.id];
        this.delBuilding();
      }
    },

    cancelSave() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.getBuildingList();
      this.resetDialog();
    },

    addBuilding() {
      this.isEdit = false; // 不是编辑，新增
      this.dialogVisible = true; // 显示弹窗
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: "",
        createtime: "",
        floor: 1,
        area: 10,
      };
    },

    async saveBuilding() {
      const params = {
        ...this.reqData,
        createtime: new Date(),
      };
      const res = await this.$http.post(api.addOrUpdateBuilding, params); // 发送请求  post
      if (res && res.isSucceed) {
        this.$message.success("新增成功");
        this.getBuildingList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delBuilding(id) {
      id ? this.selectBuilding.push(id) : "";
      const params = {
        ids: this.selectBuilding.join(","),
      };
      const res = await this.$http.post(api.delBuilding, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectBuilding = [];
      }
      this.getBuildingList();
    },
  },
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;

.building-container {
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
        width: 360px * @width;
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