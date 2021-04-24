function initAdapt() {
  adaptability = [];
  for (let i = 0; i < lessons.length; i++) {
    adaptability[i] = [];
    for (let d = 0; d < DAYS; d++) {
      for (let t = 0; t < TIMES; t++) {
        for (let r = 0; r < classRooms.length; r++) {
          // 判断不可用时段
          if (unableDayTime[d] && unableDayTime[d].includes(t)) {
            adaptability[i][index] = 0;
            continue;
          }
          var index = indexUtil.getIndex(d, t, r);
          adaptability[i][index] = adapt(i, d, t, r);
        }
      }
    }
  }
}



function initLessons() {
  lessons = [];

  var teacherConflict = {};
  lessonClasses.forEach(function (lesson, index) {
    let course = coursesMap[lesson.course];
    let timesPerWeek = course.weekHour / course.onceHour;
    let conflictArr = []; // 同一课程的不同课时不能在同一时间 需要检查冲突
    for (let i = 0; i < timesPerWeek; i++) {
      lessons.push(lesson);

      for (let t of lesson.teacher) {
        if (!teacherConflict[t]) {
          teacherConflict[t] = [];
        }
        teacherConflict[t].push(lessons.length - 1);
        conflictArr.push(lessons.length - 1);
      }
    }
    switch (timesPerWeek) {
      case 2:
        conflict.add(conflictArr, Conflict.Scope.skipDay, "同门课程" + lesson.id);
        break;
      case 3:
      case 4:
        conflict.add(conflictArr, Conflict.Scope.day, "同门课程" + lesson.id);
        break;
      default:
        conflict.add(conflictArr, Conflict.Scope.halfDay, "同门课程" + lesson.id);
    }
  });
  for (const key in teacherConflict) {
    const conflictArr = teacherConflict[key];
    conflict.add(conflictArr, Conflict.Scope.time, "教师" + key);

  }
}

