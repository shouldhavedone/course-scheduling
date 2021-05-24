<template>
  <div class="empty-container">
    <cheader title="空教室查询"></cheader>
    <div class="content-wrap">
      <div class="filter-wrap">
        <div class="search-wrap">
          <el-date-picker
            v-model="selectDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-select
            v-model="selectBuilding"
            clearable
            placeholder="请选择教学楼"
            class="select-box"
          >
            <el-option
              v-for="(item, index) in buildingList"
              :key="item.id"
              :label="item.name"
              :value="index"
            ></el-option>
          </el-select>
          <el-select
            v-model="selectTime"
            clearable
            placeholder="请选择节次"
            class="select-box"
          >
            <el-option
              v-for="(item, index) in timeList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <div class="btn-wrap">
          <el-button type="primary" @click="checkData" :loading="loading"
            >查询<i class="el-icon-search el-icon--right"></i
          ></el-button>
          <el-button type="primary" @click="clearInput"
            >清空<i class="el-icon-delete-solid el-icon--right"></i
          ></el-button>
        </div>
      </div>
      <div class="table-wrap">
        <div class="floor-item">
          <div class="floor-title">1楼</div>
          <div>
            <span
              class="floor-name"
              v-for="(item, index) in one"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">2楼</div>
          <div>
            <span
              class="floor-name"
              v-for="(item, index) in two"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">3楼</div>
          <div>
            <span
              class="floor-name"
              v-for="(item, index) in three"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">4楼</div>
          <div>
            <span
              class="floor-name"
              v-for="(item, index) in four"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
        <div class="floor-item">
          <div class="floor-title">5楼</div>
          <div>
            <span
              class="floor-name"
              v-for="(item, index) in five"
              :key="index"
              >{{ item }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import cheader from "@/components/header";
import api from "@/api/schedule";

import { emptyRoom } from "@/utils/data";

export default {
  components: {
    cheader,
  },
  data() {
    return {
      buildingList: "",
      buildingList: [],
      selectDate: "",
      selectBuilding: null,
      selectTime: "",
      timeList: ["一", "二", "三", "四", "五"],
      one: [],
      two: [],
      three: [],
      four: [],
      five: [],
      loading: false,
    };
  },

  mounted() {
    this.getBuildingList();
  },

  methods: {
    async getBuildingList() {
      const res = await this.$http.get(api.getAllBuilding);
      if (res && res.isSucceed) {
        this.buildingList = res.data;
      }
    },

    clearInput() {
      (this.selectBuilding = ""),
        (this.selectTime = ""),
        (this.selectDate = "");
    },

    getRandomArrayElements(arr, count) {
      var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },

    checkData() {
      if (!this.selectDate) {
        this.$message.error("请选择日期!");
        return false;
      }
      if (this.selectBuilding == null) {
        this.$message.error("请选择教学楼!");
        return false;
      }
      if (!this.selectTime) {
        this.$message.error("请选择上课节次!");
        return false;
      }

      this.changeData();
    },

    changeData() {
      this.loading = true;
      setTimeout(() => {
        let index = this.selectBuilding;
        this.one = this.getRandomArrayElements(
          emptyRoom[index].one,
          Math.random() * 4
        );
        this.two = this.getRandomArrayElements(
          emptyRoom[index].two,
          Math.random() * 4
        );
        this.three = this.getRandomArrayElements(
          emptyRoom[index].three,
          Math.random() * 4
        );
        this.four = this.getRandomArrayElements(
          emptyRoom[index].four,
          Math.random() * 4
        );
        this.five = this.getRandomArrayElements(
          emptyRoom[index].five,
          Math.random() * 4
        );

        this.loading = false;
      }, 2000);
    },

    buildRoomTimetable() {
      const roomId = this.selected.room;
      let gene = chromosomeSet[0].geneOrder;
      let timetable = (() => {
        let table = [];
        for (let time = 0; time < TIMES; time++) {
          table.push({
            time: time + 1,
          });
        }
        return table;
      })();
      // timetable: [ {time:1,0:"课程1",1:"课程1",2:"课程1",3:"课程1",4:"课程1",5:"课程1",6:"课程1"},
      for (let lessonIndex = 0; lessonIndex < gene.length; lessonIndex++) {
        let pos = indexUtil.getPosition(gene[lessonIndex]);
        if (classRooms[pos.room].id === roomId) {
          let lesson = lessons[lessonIndex];
          let course = coursesMap[lessons[lessonIndex].course];
          if (!timetable[pos.time][pos.day])
            timetable[pos.time][pos.day] = lessonToString(lessonIndex, gene);
          else
            timetable[pos.time][pos.day] +=
              "(冲突)" + lessonToString(lessonIndex, gene);
        }
      }
      this.timetable.room = timetable;
      this.info.room = JSON.stringify(classroomsMap[this.selected.room]);
    },
  },
};
</script>
<style lang="less">
@width: 100vw/1920px;
@height: 100vh/960px;
@height1: 50px * @height;

.empty-container {
  height: 100%;
  width: 100%;

  .content-wrap {
    height: calc(100% - @height1);
    width: 100%;
    position: relative;

    .filter-wrap {
      display: flex;
      // justify-content: space-between;
      margin: 10px * @height 0 16px * @height;

      .search-wrap {
        width: none;
        display: flex;
        align-items: center;
        margin-right: 32px * @width;

        .select-box {
          margin-left: 16px * @width;
          width: 300px * @width;
        }
      }
    }

    .table-wrap {
      width: 100%;

      & > div:not(:last-child) {
        border-bottom: 1px solid #ccc;
      }

      .floor-item {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;

        & > div:last-child {
          display: flex;
          flex-flow: wrap;
          flex: 1;
        }
      }

      .floor-title {
        width: 54px;
        font-size: 20px;
        border-right: 4px solid #ccc;
        margin-right: 20px;
      }

      .floor-name {
        display: inline-block;
        line-height: 32px;
        width: 72px;
        font-size: 16px;
        border: 1px solid #ccc;
        text-align: center;
        margin: 6px;
        border-radius: 10px;
      }
    }
  }
}
</style>