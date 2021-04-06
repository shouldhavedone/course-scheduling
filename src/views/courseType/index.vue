<template>
  <div class="courseType-container">
    <cheader title="课程类型管理"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-input
            placeholder="请输入课程类型名"
            v-model="searchName"
            class="input-with-select"
            @change="getCourseTypeList"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="addCourseType">
            新增课程类型
            <i class="el-icon-plus el-icon--right"></i>
          </el-button>
          <el-button type="primary" @click="delCourseType">
            批量删除
            <i class="el-icon-delete-solid el-icon--right"></i>
          </el-button>
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
        <cpagenation :pageparams="pageparams" @handlePage="handlePage"></cpagenation>
      </div>
    </div>

    <el-dialog :title="isEdit ? '编辑课程类型' : '新增课程类型'" :visible.sync="dialogVisible">
      <el-form :model="reqData" label-width="80px">
        <el-form-item v-if="isEdit" label="类型ID">
          <el-input v-model="reqData.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型名">
          <el-input v-model="reqData.name" placeholder="请输入课程类型名"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">取 消</el-button>
        <el-button type="primary" @click="saveCourseType">确 定</el-button>
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
      cloumn: [
        {
          prop: "name",
          label: "名称",
          minWidth: 141
        },
        {
          prop: "createtime",
          label: "创建时间",
          minWidth: 180
        },
        {
          prop: "count",
          label: "教室数量",
          minWidth: 77
        }
      ],
      tableSettings: {
        page: 1,
        rows: 12,
        isMultiple: true,
        isSaveSelect: true,
        operateBtns: [
          { id: 1, btnName: "编辑" },
          { id: 3, btnName: "删除" }
        ]
      },
      pageparams: {
        pageSize: 12,
        total: 0,
        page: 1
      },
      searchName: "",
      dialogVisible: false,
      reqData: {
        id: "",
        name: "",
        createtime: ""
      },
      isEdit: false,
      selectCourseType: []
    };
  },

  mounted() {
    this.getCourseTypeList();
  },

  methods: {
    handlePage(v) {
      this.pageparams.page = v;
      this.tableSettings.page = v;
      this.getCourseTypeList();
    },

    handleSelectionChange(val) {
      this.selectCourseType = val.map(c => c.id);
      console.log(this.selectCourseType);
    },

    showDetail(obj) {
      if (obj.id == 1) {
        this.resetDialog();
        this.isEdit = true;
        this.dialogVisible = true;
        this.reqData = obj.row;
      } else {
        this.selectCourseType = [obj.row.id];
        this.delCourseType();
      }
    },

    cancelSave() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.getCourseTypeList();
      this.resetDialog();
    },

    addCourseType() {
      this.isEdit = false;
      this.dialogVisible = true;
    },

    resetDialog() {
      this.reqData = {
        id: "",
        name: ""
      };
    },

    async getCourseTypeList() {
      const params = {
        page: this.pageparams.page,
        rows: this.pageparams.pageSize,
        name: this.searchName
      };
      this.loading = true;
      const res = await this.$http.get(
        `${api.getCourseTypeList}?${this.$qs.stringify(params)}`
      );
      console.log(res);
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

    async saveCourseType() {
      const params = {
        ...this.reqData,
        createtime: new Date()
      };
      const res = await this.$http.post(api.addOrUpdateCourseType, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.getCourseTypeList();
      }
      this.dialogVisible = false;
      this.resetDialog();
    },

    async delCourseType(id) {
      id ? this.selectCourseType.push(id) : "";
      const params = {
        ids: this.selectCourseType.join(",")
      };
      const res = await this.$http.post(api.delCourseType, params);
      if (res && res.isSucceed) {
        this.$message.success(res.message);
        this.selectCourseType = [];
        this.$nextTick(() => {
          this.getCourseTypeList();
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

.courseType-container {
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