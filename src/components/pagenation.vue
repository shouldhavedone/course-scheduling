<template>
  <div class="pagination-box c-pagenation" v-show="pageparams.total !== 0">
    <el-pagination
      :layout="pageparams.noTotal ? 'prev, pager, next' : 'total,prev, pager, next'"
      @current-change="handlePage"
      :page-size="pageparams.pageSize"
      :total="pageparams.total"
      :pager-count="pageparams.pagerCount"
      :current-page="pageparams.page"
      hide-on-single-page
      background
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: ["pageparams"],
  methods: {
    handlePage(val) {
      this.$emit("handlePage", val);
    }
  }
};
</script>
<style lang="less">
.pagination-box .el-pagination {
  button,button:disabled,li {
    background: none;
  }
}
</style>
