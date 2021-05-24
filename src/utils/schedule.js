//一些工具
// 小写字母开头的是普通函数
// 大写字母开头的均为类 使用是请new对象


/**
 * 数组随机取值 
 * 随机获取数组中的一个值 直到数组取光为止 
 * 当为正整数时 随机返回 0~n的值直到数组取光为止
 * @param {} value number 或者 Array
 */
function RandomIndex(value) {
  var _arr;
  if (value instanceof Array)
    _arr = [].concat(value); // 克隆数组
  else {
    _arr = [];
    for (let i = 0; i < value; i++) {
      _arr.push(i);

    }
  }
  this.next = () => {
    if (_arr.length > 0) {
      var ran = Math.floor(Math.random() * _arr.length);
      return _arr.splice(ran, 1)[0]
    }
  }
}

/**
* 根据时间空间获取索引 也可以反过来获取 注意要用room在数组中的index而不是Id
*/
function IndexUtil(days, times) {
  const timeLength = days * times;
  const timesArr = (() => {
    let arr = [];
    for (let t = 0; t < times; t++) {
      arr.push(t);
    }
    return arr;
  })();
  /**
   * @param {number} day 
   * @param {number} time 
   * @param {number} roomIndex 
   */
  this.getIndex = (day, time, roomIndex) => {
    return timeLength * roomIndex + times * day + time;
  }
  /**
   * 根据 index 获取 日期 时间 教室 的索引
   * @param {number} index 索引值
   * @return  json {day,time,room}
   */
  this.getPosition = (index) => {
    var room = Math.floor(index / timeLength);
    var daytime = index % timeLength;
    var day = Math.floor(daytime / times);
    var time = daytime % times;
    return { day, time, room };
  }
  /** 获取时间索引 这个值一样意味着在同一个时间点 */
  this.getDayTime = (index) => {
    return index % timeLength;
  }
  this.getDayAndTime = (index) => {
    var daytime = index % timeLength;
    var day = Math.floor(daytime / times);
    var time = daytime % times;
    return { day, time };
  }
  this.getRoom = (index) => {
    return Math.floor(index / timeLength);
  }
  this.sameHalfDay = (index) => {
    let dayAndTime = this.getDayAndTime(index);
    let timeScopeArr;
    if (dayAndTime.time < 4) {
      timeScopeArr = [0, 1, 2, 3];
    } else if (dayAndTime.time < 8) {
      timeScopeArr = [4, 5, 6, 7];
    } else {
      timeScopeArr = [8, 9, 10, 11];
    }
    return timeScopeArr.map(time => times * dayAndTime.day + time)
  }
  this.sameDay = (index) => {
    let day = this.getDayAndTime(index).day;
    return timesArr.map(time => times * day + time)
  }
  this.skipDay = (index) => {
    let day = this.getDayAndTime(index).day;
    let prevDay = day == 0 ? days - 1 : day - 1;
    let nextDay = day >= days - 1 ? 0 : day + 1;
    return timesArr.map(time => times * day + time)
      .concat(timesArr.map(time => times * prevDay + time))
      .concat(timesArr.map(time => times * nextDay + time));
  }
}


/**
* 带跳过的轮盘赌 TODO 经测试，轮盘赌是整个算法中耗时最多的部分，看看能否优化。
* @param {array} weight 课程概率数组 (下标: 元素编号、值: 该元素对应的概率)
* @param {array} skip 可选参数 跳过序号的集合 若skip=[1,2]则不会选择数组中下标为1,2的元素，其他值按原概率分部
* @param {function} negativeFilter 消极过滤函数，接受参数 时空索引，
*      返回 ture 则按照消极对待 会以极小的概率选择此值，可以认为只有没有其他任何选择时才会选中此值
* @returns {object} 返回 {index,bad} 概率数组中某一元素的下标 及是否为较差选择
*/
function roll(weights, skip, negativeFilter) {
  var sum = 0;
  var length = weights.length;
  let badSet = new Set();
  for (var i = 0; i < length; i++) {
    let weight = weights[i];
    // 当在skip数组当中 ，它的概率变为0
    if (weight == 0 || (skip && skip.includes(i))) {
      continue;
    }
    if (negativeFilter && negativeFilter(i)) {
      weight = weight * 0.000001;
      badSet.add(i);
    }
    sum += weight;
  }
  var rand = Math.random() * sum;
  sum = 0;
  for (var i = 0; i < length; i++) {
    let weight = weights[i];
    // 当在skip数组当中 ，它的概率变为0
    if (weight == 0 || (skip && skip.includes(i))) {
      continue;
    }
    if (negativeFilter && negativeFilter(i)) {
      weight = weight * 0.000001;
    }
    sum += weight;

    if (sum >= rand) {
      return i;
    }
  }
  return -1;
}

/**
* 随机整数 范围 [start,end]
* @param {*} start
* @param {*} end 
*/
function randomInt(start, end) {
  var length = end - start + 1;
  return Math.floor(Math.random() * length + start);
}

/**
* 计时和上一次的时间间隔
*/
function Timer() {
  var _time = new Date().getTime();
  this.__proto__ = {
    get: () => {
      let time = new Date().getTime();
      let interval = time - _time;
      _time = time;
      return interval;
    }
  }
}
function Logger(level) {
  this.level = level;

  this.debug = (...args) => {
    if (this.level <= Logger.LEVEL.DEBUG)
      console.log(args.reduce((a, b) => a + " " + b))
  }
  this.info = (...args) => {
    if (this.level <= Logger.LEVEL.INFO)
      console.log(args.reduce((a, b) => a + " " + b))
  }
}
Logger.LEVEL = { DEBUG: 0, INFO: 1, NONE: 2 }


/**
*  染色体类 包括基因序列 适应度
* @param {number[]} geneOrder 基因序列
* @param {number} badSelect 差选择数量
*/
function Chromosome(geneOrder, badSelect) {
  this.badSelect = badSelect;
  this.setGeneOrder = (geneOrder) => {
    _setGeneOrder(geneOrder);
  }
  var _setGeneOrder = (geneOrder) => {
    this.geneOrder = geneOrder;
    this.adapt = 0;
    for (let lessonIndex = 0; lessonIndex < geneOrder.length; lessonIndex++) {
      // 此时 i 代表课程序列 val 代表时空序列
      const spaceTimeIndex = geneOrder[lessonIndex];
      this.adapt += adaptability[lessonIndex][spaceTimeIndex];
    }
    this.adapt -= badSelect * CONFIG.badSelectVal;
  }
  _setGeneOrder(geneOrder);
}

/**
* 动态时间冲突检测
* 动态时间冲突
*/
function Conflict() {
  this._conflicts = [];
  this._conflictMap = {};
  this._campusConflicts = [];
  this._campusConflictMap = {};
  /**
   * 记录同个排课单元的课程索引
   * 添加冲突数组，代表一个冲突所关联的所有课程下标
   * 例如 老师A需要上的课程对应下标为 1,3,45,123,333 则这些下表代表一个冲突
   * @param {number[]} arr arr.length<=1会被忽略,1个元素不存在冲突
   * @param scope Conflict.Scope
   * @param {string} remark 备注 方便调试
   */
  this.add = (arr, scope, remark) => {
    if (arr.length <= 1)
      return;
    this._conflicts.push({ arr, scope, remark });
    var conflictIndex = this._conflicts.length - 1;
    for (let i = 0; i < arr.length; i++) {
      let index = arr[i];
      if (!this._conflictMap[index]) {
        this._conflictMap[index] = [];
      }
      this._conflictMap[index].push(conflictIndex)
    }
  }
  /**
   * 
   * @param {number} index 检查冲突的课程索引
   * @param {number[]} geneOrder 所属的基因序列
   * @returns {Set} 类型 geneOrder中所有和index关联课程的dayTime
   */
  this.relatedDayTime = (index, geneOrder) => {
    let conflicts = this._conflictMap[index];
    let lesson = lessons[index];
    let campus = lesson.zone;
    let set = new Set();
    if (!conflicts)
      return set;
    for (let i = 0; i < conflicts.length; i++) {
      let conflict = this._conflicts[conflicts[i]];
      let arr = conflict.arr;
      let scope = conflict.scope;
      for (let j = 0; j < arr.length; j++) {
        let lessonIndex = arr[j];
        if (lessonIndex == index)
          continue;
        let dayTimeRoom = geneOrder[lessonIndex];
        if (dayTimeRoom >= 0) {
          // set.add(indexUtil.getDayTime(dayTimeRoom))
          switch (scope) {
            case Conflict.Scope.time:
              set.add(indexUtil.getDayTime(dayTimeRoom))
              break;
            case Conflict.Scope.halfDay:
              indexUtil.sameHalfDay(dayTimeRoom).forEach(dayTimeRoom1 => set.add(dayTimeRoom1));
              break;
            case Conflict.Scope.day:
              indexUtil.sameDay(dayTimeRoom).forEach(dayTimeRoom1 => set.add(dayTimeRoom1));
              break;
            case Conflict.Scope.skipDay:
              indexUtil.skipDay(da0yTimeRoom).forEach(dayTimeRoom1 => set.add(dayTimeRoom1));
              break;
            default:
              throw "没有选择冲突时间范围"
          }
          let conflictLesson = lessons[lessonIndex];
          //校区冲突
          if (conflictLesson.zone != campus) {
            indexUtil.sameHalfDay(dayTimeRoom).forEach(dayTimeRoom1 => set.add(dayTimeRoom1));
          }
        }
      }
    }
    return set;
  }
  /**
   * 返回所有与 lessonIndex时间冲突的课程index
   */
  this.getRelatedArr = (index) => {
    let conflictIndexArr = this._conflictMap[index];
    let result = [];// 包含所有不能与他相同时间的课程
    if (conflictIndexArr) {
      for (let i = 0; i < conflictIndexArr.length; i++) {
        let conflictIndex = conflictIndexArr[i];
        let conflict = this._conflicts[conflictIndex];
        let conflictArr = conflict.arr;
        result = result.concat(conflictArr);
      }
    }
    let set = new Set(result);
    set.delete(index);
    return Array.from(set);// 去重
  }
}
/**
* 冲突的时间占用范围，例如老师、班级的不同课程只要不在同一时间即可 选择time
* 跨校区冲突选择 halfDay
* 
*/
Conflict.Scope = {
  time: 0,
  halfDay: 1,
  day: 2,
  skipDay: 3
}


const CONFIG = {
  /** 染色体数量 */
  chromosomeNum: 20,
  /** 迭代次数 */
  iteratorNum: 200,
  /** 不参加交叉直接保留给下一代的最好基因 应该小于crossRate 在小数据量下测试0.15是最佳选择 */
  survivalRate: 0.15,
  /** 有权繁殖下一代的比例 按照适应度排序  取值(0,1) 取值过大难以淘汰劣势基因，取值过小容易过早陷入局部最优解 */
  crossRate: 0.5,
  /** 变异比例  取值[0,1) 不宜太大,较大会减少优势基因,并且影响运行效率 */
  varyRate: 0.05,
  // /** 发生冲突时 重试的次数 在减少冲突和保证效率间找到平衡 */
  // conflictRetry : 100,

  // 以下为适应度参数
  /** 初始的适应度值 一个不太大的正整数 */
  initAdaptValue: 30,
  /** 一个绝对值较大的负数,代表完全不可用的适应度，保证适应度+unable<=0*/
  unable: -10000,
  /** 差选择扣分：生成基因过程中产生的冲突数量，每个冲突是一个“差选择”，每个差选择扣除一定的适应度值的比例，
   * 不宜太大，会影响基因的丰富程度，迭代效果下降 */
  badSelectVal: 15
}


/** 一天的课时 */
const TIMES = 12;
/** 一周上课日 规定 0-6为周一-周日 */
const DAYS = 7;
/**
 * 不可用时段
 * 例如{ 0:[1,2],4:[4,7] } 代表不可用时间段为周1 1,2节课 周5 4,7节课 
 */
const unableDayTime = {};
/** 初始排一周课时的上课日遍历顺序 */
var daySels = [1, 4, 3, 2, 5, 6];


/** 教学楼*/
var buildings = [
  // { id: 70001, floor: 20 },
  // { id: 70002, floor: 5 },
  // { id: 70003, floor: 8 },
  // { id: 70004, floor: 12 },
  // { id: 70005, floor: 0 },
  // { id: 70006, floor: 10 },
  // { id: 70007, floor: 18 },
  // { id: 70008, floor: 3 },
  // { id: 70009, floor: 0 }
];
var buildingsMap = {};



/** 教室 */
var classRooms = [
  // { id: 50001, count: 40, building_id: 70001, floor: 5, name: 502 },
  // { id: 50002, count: 120, building_id: 70001, floor: 12, name: 1201 },
  // { id: 50003, count: 30, building_id: 70002, floor: 3, name: 302 },
  // { id: 50004, count: 40, building_id: 70004, floor: 4, name: 406 },
  // { id: 50005, count: 140, building_id: 70005, floor: 0, name: 1 },
  // { id: 50006, count: 60, building_id: 70006, floor: 5, name: 505 },
  // { id: 50007, count: 150, building_id: 70009, floor: 0, name: 1 }
];
var classroomsMap = {};


/** 
 * 课程教学班
 * 原名 classes 改为 lessons不会引起歧义
 * 以后还要加入 班级约束 
 */
var lessonClasses = [
  // { id: 30101, course_id: 10001, teacher_id: 20001, number: 28 },
  // { id: 30102, course_id: 10001, teacher_id: 20001, number: 28 },
  // { id: 30201, course_id: 10002, teacher_id: 20002, number: 90 },
  // { id: 30301, course_id: 10003, teacher_id: 20001, number: 48 },
  // { id: 30302, course_id: 10003, teacher_id: 20003, number: 52 },
  // { id: 30303, course_id: 10003, teacher_id: 20004, number: 28 },
  // { id: 30401, course_id: 10004, teacher_id: 20005, number: 28 },
  // { id: 30402, course_id: 10004, teacher_id: 20005, number: 28 },
  // { id: 30501, course_id: 10005, teacher_id: 20003, number: 24 },
  // { id: 30502, course_id: 10005, teacher_id: 20003, number: 24 },
  // { id: 30503, course_id: 10005, teacher_id: 20004, number: 28 },
  // { id: 30504, course_id: 10005, teacher_id: 20004, number: 24 },
  // { id: 30601, course_id: 10006, teacher_id: 20006, number: 28 },
  // { id: 30602, course_id: 10006, teacher_id: 20006, number: 28 },
  // { id: 30701, course_id: 10007, teacher_id: 20008, number: 28 },
  // { id: 30702, course_id: 10007, teacher_id: 20008, number: 28 },
  // { id: 30801, course_id: 10008, teacher_id: 20009, number: 28 },
  // { id: 30802, course_id: 10008, teacher_id: 20009, number: 28 },
  // { id: 30803, course_id: 10008, teacher_id: 20009, number: 28 },
  // { id: 30901, course_id: 10009, teacher_id: 20012, number: 88 }
];

/** 课程教学班 每一个连续开设的课程都是一个lesson 包括一个教学班一周内的多次开课 */
var lessons = [];


/** 教师  disableTime-不可排课的时间段（302-周三的第3/4课时*/
var teachers = [
  // { id: 20001, name: '教师1' },
  // { id: 20002, name: '教师2' },
  // { id: 20003, name: '教师3' },
  // { id: 20004, name: '教师4' },
  // { id: 20005, name: '教师5' },
  // { id: 20006, name: '教师6' },
  // { id: 20007, name: '教师7' },
  // { id: 20008, name: '教师8' },
  // { id: 20009, name: '教师9' },
  // { id: 20010, name: '教师10' },
  // { id: 20011, name: '教师11' },
  // { id: 20012, name: '教师12' }
];
var teachersMap = {};


/** 课程 
 *     one_hours: 上一次课的课时，实际应用中根据统一规则来计算，若有例外则单独指定或手工排课
 *    timeRequire: 上课的特殊时间要求 day-周几（为null则无特殊要求）, time-课时范围（为null则无特殊要求）
 */
var courses = [
  // { id: 10001, name: '游戏设计', week_hours: 4, class_hours: 34, one_hours: 2, timeRequire: null },
  // { id: 10002, name: '计算机原理', week_hours: 4, class_hours: 34, one_hours: 2, timeRequire: null },
  // { id: 10003, name: '大学英语', week_hours: 4, class_hours: 16, one_hours: 2, timeRequire: null },
  // { id: 10004, name: 'JAVA语言', week_hours: 4, class_hours: 34, one_hours: 2, timeRequire: null },
  // { id: 10005, name: '英语听力', week_hours: 2, class_hours: 14, one_hours: 2, timeRequire:null },
  // { id: 10006, name: '通信原理', week_hours: 4, class_hours: 48, one_hours: 2, timeRequire: null },
  // { id: 10007, name: '数据结构', week_hours: 2, class_hours: 34, one_hours: 2, timeRequire: null },
  // { id: 10008, name: '经济学基础', week_hours: 6, class_hours: 34, one_hours: 2, timeRequire: null },
  // { id: 10009, name: '体育', week_hours: 2, class_hours: 20, one_hours: 2, timeRequire: null}
];
var coursesMap = {};

/** 任务处理适应度结果集([迭代次数][染色体编号] = 适应度) */
var logGenData = [];


/**
 * 结果集 即 染色体合集 即 种群. 
 * 例如 8门课 排2天*8段*2教室=32个时空位置 则每个染色体的长度为8 按课程数组的顺序排列 每门课的的时空位置在0-31中取值，不可重复. 
形如：
[
    [1,3,2,20,15,13,6,7], // chromosomeSet 中存的是 Chromosome 对象 其中包含了这个基因序列
    [32,3,2,12,1,5,4,7],
    ...
]
 */
var chromosomeSet;


/** 适应度矩阵(下标：染色体编号、值：该染色体的适应度) 
 * 下表为课程编号，内部数组为该课程对于每个时空编号的适应度
 * 例如 8门课 排2天*8段*2教室=32个时空位置 则每个染色体的长度为8 按课程数组的顺序排列 每个内部数组长度为32 
形如：
[
    [1,1,1,1,2,3,4,5....,0,12,344,12],  //长度为32 classes[0]
    [32,1,1,11,2,3,4,5....,0,12,344,12], //长度为32 classes[1]
    ... 一共8个数组
]
*/
var adaptability;
// end 变量定义

const indexUtil = new IndexUtil(DAYS, TIMES); indexUtil.hh
const logger = new Logger(Logger.LEVEL.INFO);
const conflict = new Conflict();
// 算法入口
export const gaMain = (buildingData, courseData, classRoomData, teacherData, lessonClassData) => {
  console.log(buildings)
  console.log(courses)
  console.log(classRooms)
  console.log(teachers)
  console.log(lessonClasses)
  buildings = buildingData;
  courses = courseData;
  classRooms = classRoomData;
  teachers = teacherData;
  lessonClasses = lessonClassData
  var timer = new Timer();
  // 初始化map缓存
  initCaches();
  logger.info("初始化map完成\tcost:", timer.get());
  // 初始化课程 包括动态冲突关联
  initLessons();
  logger.info("初始化课程完成\tcost:", timer.get());
  // 初始化适应度
  initAdapt();
  logger.info("初始化适应度完成\tcost:", timer.get());
  initChromosome();
  logger.info("初始化基因完成\tcost:", timer.get());
  logGenData = [];
  gaIterate(CONFIG.iteratorNum);
  logger.info("迭代完成\t\t\tcost:", timer.get());

  
}
/**
 * 父母基因交叉获得下一代染色体
 * @param {*} father Chromosome对象
 * @param {*} mother Chromosome对象
 */
function cross(fatherGene, motherGene) {
  /*
  交叉时 有一个棘手的问题
  例如
  父基因 [1,2,9,4,7,6,8,5]
  母基因 [1,3,2,4,5,6,7,8]
  子基因随机从两边获取
  子基因 [1,2,2,4,7,6,7,8]
  则获得了不可用的基因序列 因为(时间*教室)的序号重复了 即 选择了同一时间的同一教室 得到了冲突的解
  因此我们引入一个“相关基因”的概念：
  在上述例子中
  父母基因存在两对相关基因 2,9--3,2 7,8,5--5,7,8 相关基因必须当做一个基因做整体的调整
  对应数组中的索引位置为 (2,3) (4,6,8)
  上述父母基因可以表示为关联基因的形式,数组中存储的是下标
  relatedGene = [[0],[1,2],[3],[4,6,8],[5]] 相关基因作为一个数组当做一个单独的基因进行选择

  */
  var childGene = [];// 以父基因为基础添加母基因来实现交叉
  var set = new Set(); // 用于保存已经关联的基因
  var relatedGenes = []; //关联基因的索引
  // 遍历寻找关联基因
  for (let i = 0; i < fatherGene.length; i++) {
    if (set.has(i))
      continue;
    let gene = motherGene[i];
    let point = fatherGene.indexOf(gene);
    let related = [i];
    // 当父基因组中存相同的基因且不是初始索引位置
    // 关联基因寻找完成的标志为：
    // 1 形成闭环  例如 [1,2,3] 和 [2,3,1]
    // 2 不再存在相同的基因  例如 [1,2,3] 和 [2,3,5]
    while (point >= 0 && point != i) {
      gene = motherGene[point];
      set.add(point);
      related.push(point);
      point = fatherGene.indexOf(gene);
    }
    relatedGenes.push(related);
  }
  for (let i = 0; i < relatedGenes.length; i++) {
    let releted = relatedGenes[i];
    let fromFather = Math.random() < 0.5 ? true : false;

    for (let j = 0; j < releted.length; j++) {
      let index = releted[j];
      childGene[index] = fromFather ? fatherGene[index] : motherGene[index];
    }
  }
  return childGene;
}
/**
 * 检查子代基因的动态冲突并计数
 * @param {number[]} gene 基因序列
 */
function checkBadSelect(gene) {
  let badSelect = 0;
  for (let i = 0; i < gene.length; i++) {
    // let adapt = adaptability[i];
    let check = conflict.relatedDayTime(i, gene);
    if (check.has(indexUtil.getDayTime(gene[i]))) {
      badSelect++;
    }
  }
  return badSelect;
}
/**
 * 变异
 * @param {number[]} geneOrder 基因序列
 */
function vary(geneOrder) {
  for (let i = 0; i < geneOrder.length; i++) {
    if (Math.random() < CONFIG.varyRate) {
      let adapt = adaptability[i];
      let conflictSet = conflict.relatedDayTime(i, geneOrder);
      let result = roll(adapt, geneOrder, dayTimeRoom => conflictSet.has(indexUtil.getDayTime(dayTimeRoom)));
      if (result >= 0) {
        geneOrder[i] = result;
      }
    }
  }
}
/**
 * 遗传迭代
 * @param {number} num 迭代的次数
 */
function gaIterate(num) {
  var timer = new Timer()
  logger.info("---开始迭代---");
  for (let i = 0; i < num; i++) {
    logger.info("---第" + i + "代\tcost:", timer.get(), "---");
    let nextGen = []; // 下一代染色体集合
    logGenData.push(chromosomeSet.map(chromosome => chromosome.adapt));

    //保留最好的基因直接传给下一代
    var survivalCount = chromosomeSet.length * CONFIG.survivalRate;
    for (let i = 0; i < survivalCount && nextGen.length < CONFIG.chromosomeNum; i++) {
      nextGen.push(chromosomeSet[i])
    }
    // 有权参与交叉的基因数量
    var crossCount = (chromosomeSet.length - 1) * CONFIG.crossRate; // randomInt函数是包括末尾的 所以 length-1
    // survival==1会导致程序死循环 虽然一般不会这么设置这么小的值
    if (crossCount <= 1)
      throw "PARAM.crossRate 的值过小 没有足够的父代够供交叉配对"
    while (nextGen.length < CONFIG.chromosomeNum) {
      let fatherIndex = randomInt(0, crossCount);
      let motherIndex = randomInt(0, crossCount);
      if (fatherIndex == motherIndex) { // 不可自交
        continue;
      }
      let father = chromosomeSet[fatherIndex];
      let mother = chromosomeSet[motherIndex];
      // 交叉
      let child = cross(father.geneOrder, mother.geneOrder);
      // 变异
      vary(child);
      let badSelect = checkBadSelect(child);
      nextGen.push(new Chromosome(child, badSelect))
    }
    chromosomeSet = nextGen;
    chromosomeSet.sort((a, b) => b.adapt - a.adapt); //染色体根据适应度由大到小排序
  }
}
function initLessons() {
  lessons = [];
  // TODO 动态时间冲突检测如果多起来，可写成类似静态条件的工厂方法
  /** 教师冲突 */
  let teacherConflict = {};
  lessonClasses.forEach(function (lesson, index) {
    let course = coursesMap[lesson.course_id];
    let timesPerWeek = course.week_hours / course.one_hours;
    let conflictArr = []; // 同一课程的不同课时不能在同一时间 需要检查冲突
    for (let i = 0; i < timesPerWeek; i++) {
      lessons.push(lesson);
      if (!teacherConflict[lesson.teacher]) {
        teacherConflict[lesson.teacher] = [];
      }
      teacherConflict[lesson.teacher].push(lessons.length - 1);
      conflictArr.push(lessons.length - 1);
    }
    // 同门课程动态冲突 ，一周两节 则保证不在相邻天 3-4节保证不在同一天 否则保证不在同个半天
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
function initCaches() {
  courses.forEach(function (course, index) {
    coursesMap[course.id] = course;
  });

  teachers.forEach(function (teacher, index) {
    teachersMap[teacher.id] = teacher;
  });

  buildings.forEach(function (building, index) {
    buildingsMap[building.id] = building;
  });

  classRooms.forEach(function (classroom, index) {
    classroomsMap[classroom.id] = classroom;
  });
}
/**
 * 初始化染色体
 */
function initChromosome() {
  chromosomeSet = [];
  var timer = new Timer();
  for (let i = 0; i < CONFIG.chromosomeNum; i++) {
    let chromosome = generateChromosome();
    chromosomeSet.push(generateChromosome());
    logger.info("初始化基因", i, timer.get())
  }
  chromosomeSet.sort((a, b) => b.adapt - a.adapt);
}
/**
 * 随机生成一组染色体 轮盘赌
 */
function generateChromosome() {

  var gene = [];
  // 从所有课程中随机取值 而不是从第一个开始 避免每次都是排在数组最开始位置的课程有最优先的选择，使种群的基因更丰富
  var randomIndex = new RandomIndex(adaptability.length);
  var lessonIndex;
  var badSelect = 0;
  while ((lessonIndex = randomIndex.next()) >= 0) {
    let adapt = adaptability[lessonIndex]
    let conflictSet = conflict.relatedDayTime(lessonIndex, gene);
    let result = roll(adapt, gene, roomTime => conflictSet.has(indexUtil.getDayTime(roomTime)));
    let dayTimeRoom = result;
    gene[lessonIndex] = dayTimeRoom;
  }
  var chromosome = new Chromosome(gene, badSelect);

  return chromosome;
}

/**
 * 根据约束条件初始化适应度
 */
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
// start 适应度条件
/**
 * 根据condition数组中的所有条件来改变适应度的值
 * @param {number} lessonIndex 课程数组中的下标
 * @param {number} day 排课周期中的第几天 
 * @param {number} time 一天的第几个课时
 * @param {number} roomIndex 教室数组中的下标
 */
function adapt(lessonIndex, day, time, roomIndex) {
  // lesson {id:30101, course:10001, teacher:20001, number:28, zone:Zone.SP}
  // course {id:10001, name:'高等数学', week_hours:4, class_hours:34, roomType:RoomType.NORMAL, one_hours:2, timeRequire:null},
  var lesson = lessons[lessonIndex];
  var value = CONFIG.initAdaptValue;

  for (let i = 0; i < fixedCondition.length; i++) {
    if (value == 0) // 不可用时段
      continue;
    const conditionFunction = fixedCondition[i];
    value += conditionFunction(lesson, day, time, roomIndex, value)
    if (value < 0) {
      value = 0;
    }
  }
  return value;
}

/*
 * 满足的约束（冲突）  √ 代表已解决
 * 
 * √ 同一时间片一个教师只能上一门课程
 * √ 某一教室的某一时间片只能被一门课程占用
 * √ 某班学生在某一时间片只能被安排在一个教室上课
 * √ 某课程m必须安排在预定的时间片n上
 * √ 某教师m在时间片n时不能上课
 * √ 课程对教室的要求 
 * √ 同一课程的一次课分配在同一时段（上午/下午/晚上）
 * √ 较高的教室利用率（上课人数
 * √ 晚上/周二下午/周六尽量不排课 （这个应该是动态设置的）
 * √ 同一教学班任务不要在同一天内连续的开课，一周内同一门课程均匀分布 动态冲突 a)一周2节保证不在相邻天排课 b)3-5节保证不在同一天排课
 * √ 老师不能在同一个半天上跨校区课
*/
/**
 * 此处为固定条件 动态条件需要每次迭代修改适应度 
 * 例如 课程的时间教室类型选择属于固定条件
 * 老师或学生的时间冲突属于动态条件
 * 
 */
var fixedCondition = [
  // 注意适用性越普遍的条件放在数组的越前方 可增加效率
  // 单节时间需求
  function (lesson, day, time, roomIndex, value) {
    /** 联排不可用的时间段 2-两节联排 3-三节联排 4-四节联排 从0开始 */
    var unitUnableTime = {
      1: [],
      2: [1, 3, 5, 7, 9, 11],
      3: [2, 3, 6, 7, 8, 9, 10, 11],
      4: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11]
    };
    // lesson {id:30101, course:10001, teacher:20001, number:28, zone:Zone.SP}
    // {id:10001, name:'游戏设计', week_hours:4, class_hours:34, roomType:RoomType.NORMAL, one_hours:2, timeRequire:null}
    var course = coursesMap[lesson.course_id];
    var unable = unitUnableTime[course.one_hours];
    if (unable.includes(time)) {
      return CONFIG.unable;
    }
    return 0;
  },
  // 公共不可用时间 此例中为周日不排课 晚上/周二下午/周六尽量不排课 早上排课更优先
  function (lesson, day, time, roomIndex, value) {
    if (day == 6) { // 周日不排课
      return CONFIG.unable;
    }
    if (time >= 8 || (day == 1 && time >= 4)) { // 晚上/周二下午不排课
      return CONFIG.unable;
    }
    let val = 0;
    if (day == 5) { // 周六尽量不排课
      val += -10;
    }
    if (time < 4) { // 早上最优先
      val += 6;
    }
    if (time >= 4 && time < 6) { // 下午前两节优先
      val += 3;
    }
    return val;
  },
  // 课程时间需求 course timeRequire
  function (lesson, day, time, roomIndex, value) {
    // timeRequire:{day:[2,4], time:[1,2,3,4]}
    // timeRequire:{day:null, time:[1,2,3,4]}
    // timeRequire:{day:[1,3], time:[1,2,3,4]}
    // var timeRequire = coursesMap[lesson.course].timeRequire;
    // if (timeRequire) {
    //   if (timeRequire.day && timeRequire.time) {
    //     if (timeRequire.day.includes(day) && timeRequire.time.includes(time)) {
    //       logger.debug('满足课程 day time:', timeRequire.day, timeRequire.time);
    //       return 10;
    //     }
    //   } else if (timeRequire.day) {
    //     if (timeRequire.day.includes(day)) {
    //       logger.debug('满足课程 day:', timeRequire.time);
    //       return 5;
    //     }
    //   } else if (timeRequire.time) {
    //     if (timeRequire.time.includes(time)) {
    //       logger.debug('满足课程 time:', timeRequire.time);
    //       return 5;
    //     }
    //   } else {
    //     logger.debug('不满足课程 timeRequire:', timeRequire.time);
    //     return CONFIG.unable;
    //   }
    // }
    return 0;
  },
  // 教室类型
  function (lesson, day, time, roomIndex, value) {
    var course = coursesMap[lesson.course];
    var room = classRooms[roomIndex];
    // if (buildingsMap[room.building].zone != lesson.zone) {
    //     logger.debug('不满足校区要求 lesson:', lesson.id);
    //     return CONFIG.unable;
    // }
    // if (course.roomType != room.roomType) {
    //     logger.debug('不满足教室类型 lesson:', lesson.id, 'roomtype', room.roomType);
    //     return CONFIG.unable;
    // }
    var ratio = lesson.number / room.count;
    if (ratio > 1) {
      logger.debug('教室容量不足 lesson:', lesson.id, 'number', lesson.number, 'count', room.count);
      return CONFIG.unable;
    }
    if (ratio > 0.8) {
      return 10;
    }
    if (ratio < 0.5) {
      return -5;
    }

    return 0;
  }
];
// end 适应度条件




export const lessonToString = (lessonIndex, geneOrder) => {
    let lesson = lessons[lessonIndex];
    let course = coursesMap[lessons[lessonIndex].course];
    let roomId = classRooms[indexUtil.getRoom(geneOrder[lessonIndex])].id
    return "[" + lessonIndex + "]" + lesson.id + course.name + "/" + lesson.teacher + "/" + lesson.zone
        + "/" + course.onceHour + "/" + lesson.studentNum + "/" + roomId;
}
export const roomToString = (roomId) => {
    let room = classroomsMap[roomId];
    return room ? "教室:" + room.id + " 校区:" + buildingsMap[room.building].zone + " 容量:" + room.capacity + " 类型:" + room.roomType : "";
}