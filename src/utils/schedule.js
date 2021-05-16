// function initAdapt() {
//   adaptability = [];
//   for (let i = 0; i < lessons.length; i++) {
//     adaptability[i] = [];
//     for (let d = 0; d < DAYS; d++) {
//       for (let t = 0; t < TIMES; t++) {
//         for (let r = 0; r < classRooms.length; r++) {
//           // 判断不可用时段
//           if (unableDayTime[d] && unableDayTime[d].includes(t)) {
//             adaptability[i][index] = 0;
//             continue;
//           }
//           var index = indexUtil.getIndex(d, t, r);
//           adaptability[i][index] = adapt(i, d, t, r);
//         }
//       }
//     }
//   }
// }



// function initLessons() {
//   lessons = [];

//   var teacherConflict = {};
//   lessonClasses.forEach(function (lesson, index) {
//     let course = coursesMap[lesson.course];
//     let timesPerWeek = course.weekHour / course.onceHour;
//     let conflictArr = []; // 同一课程的不同课时不能在同一时间 需要检查冲突
//     for (let i = 0; i < timesPerWeek; i++) {
//       lessons.push(lesson);

//       for (let t of lesson.teacher) {
//         if (!teacherConflict[t]) {
//           teacherConflict[t] = [];
//         }
//         teacherConflict[t].push(lessons.length - 1);
//         conflictArr.push(lessons.length - 1);
//       }
//     }
//     switch (timesPerWeek) {
//       case 2:
//         conflict.add(conflictArr, Conflict.Scope.skipDay, "同门课程" + lesson.id);
//         break;
//       case 3:
//       case 4:
//         conflict.add(conflictArr, Conflict.Scope.day, "同门课程" + lesson.id);
//         break;
//       default:
//         conflict.add(conflictArr, Conflict.Scope.halfDay, "同门课程" + lesson.id);
//     }
//   });
//   for (const key in teacherConflict) {
//     const conflictArr = teacherConflict[key];
//     conflict.add(conflictArr, Conflict.Scope.time, "教师" + key);

//   }
// }

/*
 * @Description: 
 * @version: 1.0.0
 * @Author: wutao
 * @Date: 2021-05-12 15:07:44
 * @LastEditTime: 2021-05-12 15:17:54
 */
const MAX_DAY = 5; //   排课周期
const MAX_TIME = 4;  //  每日排课时段
const TIME_LEN = MAX_DAY * MAX_TIME;   // 时段数量

/**
 * @name: getIndex
 * @msg: 获取结果值
 * @param {*} day // 日期
 * @param {*} time  // 时段
 * @param {*} room  // 教室数量
 * @return {*} number
 */
let getIndex = (day, time, room) => {
  return TIME_LEN * room + MAX_TIME * day + time;
}

/**
 * @name: getPosition
 * @msg: 根据 index 获取 日期 时间 教室的索引
 * @param {*} index  // 结果值
 * @return {*} {}
 */
let getPosition = (index) => {
  let room = Math.floor(index / TIME_LEN);
  let daytime = index % TIME_LEN;
  let day = Math.floor(daytime / MAX_TIME);
  let time = daytime % MAX_TIME;
  return { day, time, room };
}

/**
 * @name: getDayTime
 * @msg: 获取时间索引，可用于比较是否为相同时间
 * @param {*} index
 * @return {*}  number
 */
let getDayTime = (index) => {
  return index % TIME_LEN;
}


console.log(getIndex(1, 2, 8))

console.log(getPosition(20))

console.log(getDayTime(66))