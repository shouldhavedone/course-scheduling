<template>
  <div class="c-table">
    <el-table
      :data="data"
      stripe
      border
      :row-key="getRowKey"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      ref="multipleTable"
      @sort-change="sortChange"
      @row-dblclick="rowDBLClick"
      :default-sort="{ prop: 'createtime', order: 'descending' }"
    >
      <el-table-column width="50" align="center">
        <template slot-scope="scope">
          <div>
            {{ scope.$index + 1 + (settings.page - 1) * settings.rows }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55"
        align="center"
        v-if="settings.isMultiple && cloumn.length"
        :reserve-selection="settings.isSaveSelect"
      ></el-table-column>
      <template v-for="(item, index) in cloumn">
        <template v-if="item.prop != 'createtime'">
          <el-table-column
            v-bind="item"
            v-if="!item.scope"
            :key="index"
            align="left"
            :min-width="item.minWidth"
            :width="item.width"
            :show-overflow-tooltip="item.tooltip"
            :class-name="item.className"
          ></el-table-column>
          <slot v-if="item.scope" :name="item.prop"></slot>
        </template>

        <template v-if="item.prop == 'createtime'">
          <el-table-column
            sortable="custom"
            v-bind="item"
            v-if="!item.scope"
            :key="index"
            align="left"
            :min-width="item.minWidth"
            :width="item.width"
          ></el-table-column>
          <slot v-if="item.scope" :name="item.prop"></slot>
        </template>
      </template>
      <el-table-column
        fixed="right"
        align="left"
        label="操作"
        class-name="operate"
        min-width="100"
        v-if="settings.operateBtns && settings.operateBtns.length > 0"
      >
        <template slot-scope="scope">
          <template v-for="(item, index) in settings.operateBtns">
            <el-button
              @click="handleClick(item.id, scope.row)"
              type="text"
              size="small"
              v-if="item.id != 'useBtn'"
              :class="scope.row.status != 0 && item.id == 'chuli' ? 'vib' : ''"
              :key="index"
              >{{ item.btnName }}</el-button>
            <el-button
              @click="handleClick(item.id, scope.row)"
              type="text"
              size="small"
              v-if="item.id == 'useBtn'"
              :class="scope.row.def5 == 0 ? 'green' : 'red'"
              :key="index"
              >{{ scope.row.def5 == 0 ? '启用' : '停用' }}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ["data", "cloumn", "settings"],
  methods: {
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    getRowKey(row) {
      return row.id;
    },
    rowClick(row) {
      this.$emit("rowClick", row);
    },
    handleClick(id, row) {
      this.$emit("btnClick", { id, row });
    },
    sortChange(column, prop, order) {
      this.$emit("sortChange", column);
    },
    rowDBLClick(row, column, event) {
      this.$emit("btnClick", { id: 1, row });  // id: 1 编辑  2 详情  3 删除
    },
  },
};
</script>
<style lang="less">
.c-table {
  width: 100%;
  .el-table {
    .vib {
      visibility: hidden;
    }
    .green {
      color: rgba(43, 211, 161);
    }
    .red {
      color: #fe4774;
    }
    th .el-checkbox__inner {
      border: 1px solid rgba(147, 187, 255);
    }

    // th {
    //   font-size: 14px;
    // }

    // tr td {
    //   font-size: 12px;
    //   color: rgba(51, 51, 51, 1);
    //   padding: 4px 0;
    // }
  }
}
</style>