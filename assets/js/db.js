class Lesson {
  constructor(academicIntegration, agenda, assessment, cteProgram, duration, labTitle, labDuration, lessonNum,
    lessonTitle, notes, objectives, profStandards, school, startDate, teacherName, techStandards,
    unitNum, unitTitle, vocab, workBasedLearning) {
    this.academicIntegration = academicIntegration;
    this.agenda = agenda;
    this.assessment = assessment;
    this.cteProgram = cteProgram;
    this.duration = duration;
    this.labTitle = labTitle;
    this.labDuration = labDuration;
    this.lessonNum = lessonNum;
    this.lessonTitle = lessonTitle;
    this.notes = notes;
    this.objectives = objectives;
    this.profStandards = profStandards;
    this.school = school;
    this.startDate = startDate;
    this.teacherName = teacherName;
    this.techStandards = techStandards;
    this.unitNum = unitNum;
    this.unitTitle = unitTitle;
    this.vocab = vocab;
    this.workBasedLearning = workBasedLearning;
    this.lessons = [];
  }
}



var lessonConverter = {
  toFirestore: function (lesson) {
    return {
      "academic-integration": lesson.academicIntegration,
      agenda: lesson.agenda,
      assessment: lesson.assessment,
      "cte-program": lesson.cteProgram,
      duration: lesson.duration,
      "lab-title": lesson.labTitle,
      "lab-duration": lesson.labDuration,
      "lesson-num": lesson.lessonNum,
      "lesson-title": lesson.lessonTitle,
      notes: lesson.notes,
      objectives: lesson.objectives,
      "prof-standards": lesson.profStandards,
      school: lesson.school,
      "start-date": lesson.startDate,
      "teacher-name": lesson.teacherName,
      "tech-standards": lesson.techStandards,
      "unit-num": unitNum,
      "unit-title": lesson.unitTitle,
      vocab: lesson.vocab,
      "work-based-learning": workBasedLearning
    }
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Lesson(data["academic-integration"], data["agenda"], data["assessment"], data["cte-program"],
      parseInt(data["duration"]), data["lab-title"], parseInt(data["lab-duration"]), parseInt(data["lesson-num"]), data["lesson-title"], data["notes"], data["objectives"],
      data["prof-standards"], data["school"], data["start-date"], data["teacher-name"], data["tech-standards"], parseInt(data["unit-num"]),
      data["unit-title"], data["vocab"], data["work-based-learning"]);
  }
};

const noSchoolDays = new Map();
const oneDayMilli = 24 * 60 * 60 * 1000;
const dateKeyOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
setNoSchoolDays();

function getFirstDayOfSchool() {
  var now = new Date(Date.now());
  var currMonth = now.getMonth();
  var year = now.getFullYear();
  if (currMonth < 7) {
    year--;
  }
  var date = new Date("8/1/" + year);
  while (date.toLocaleDateString("en-us", { weekday: 'long' }) != "Thursday") {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function getDateThisSchoolYear(date = new Date(Date.now())){
  var now = new Date(Date.now());
  var currMonth = now.getMonth();
  var year = now.getFullYear();
  if (currMonth < 6 && date.getMonth() >= 6) {
    year--;
  }
  
  var result = new Date();
  result.setTime(date.getTime())
  result.setMonth(date.getMonth());
  result.setDate(date.getDate());
  result.setFullYear(year);
  while (!isSchoolDay(result)){
    result.setMilliseconds(result.getMilliseconds() + oneDayMilli);
  }
  return result;
}

function getSchoolDaysBetween(date1, date2) {
  var days = 0;
  for (var d = new Date(date1.getTime()); d < date2; d.setMilliseconds(d.getMilliseconds() + oneDayMilli)) {
    if (isSchoolDay(d)) days++;
  }
  //console.log("Total school days ", days);
  return days;
}

function setNoSchoolDays() {
  noSchoolDays.set(new Date("8/3/2022").toLocaleDateString('en-us', dateKeyOptions), "Teacher Prep Day")
  noSchoolDays.set(new Date("8/25/2022").toLocaleDateString('en-us', dateKeyOptions), "Professional Learning Day");
  noSchoolDays.set(new Date("9/5/2022").toLocaleDateString('en-us', dateKeyOptions), "Labor Day");
  noSchoolDays.set(new Date("10/7/2022").toLocaleDateString('en-us', dateKeyOptions), "Grading Day");
  noSchoolDays.set(new Date("10/10/2022").toLocaleDateString('en-us', dateKeyOptions), "Fall Break");
  noSchoolDays.set(new Date("10/11/2022").toLocaleDateString('en-us', dateKeyOptions), "Fall Break");
  noSchoolDays.set(new Date("10/12/2022").toLocaleDateString('en-us', dateKeyOptions), "Fall Break");
  noSchoolDays.set(new Date("10/13/2022").toLocaleDateString('en-us', dateKeyOptions), "Fall Break");
  noSchoolDays.set(new Date("10/14/2022").toLocaleDateString('en-us', dateKeyOptions), "Fall Break");
  noSchoolDays.set(new Date("11/3/2022").toLocaleDateString('en-us', dateKeyOptions), "Professional Learning Day");
  noSchoolDays.set(new Date("11/11/2022").toLocaleDateString('en-us', dateKeyOptions), "Veteran's Day");
  noSchoolDays.set(new Date("11/24/2022").toLocaleDateString('en-us', dateKeyOptions), "Thanksgiving Break");
  noSchoolDays.set(new Date("11/25/2022").toLocaleDateString('en-us', dateKeyOptions), "Thanksgiving Break");
  noSchoolDays.set(new Date("12/23/2022").toLocaleDateString('en-us', dateKeyOptions), "Grading Day");
  noSchoolDays.set(new Date("12/26/2022").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("12/27/2022").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("12/28/2022").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("12/29/2022").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("12/30/2022").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("1/2/2023").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("1/3/2023").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("1/4/2023").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("1/5/2023").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("1/6/2023").toLocaleDateString('en-us', dateKeyOptions), "Winter Break");
  noSchoolDays.set(new Date("1/16/2023").toLocaleDateString('en-us', dateKeyOptions), "MLK Day");
  noSchoolDays.set(new Date("1/26/2022").toLocaleDateString('en-us', dateKeyOptions), "Professional Learning Day");
  noSchoolDays.set(new Date("2/23/2023").toLocaleDateString('en-us', dateKeyOptions), "Rodeo Break");
  noSchoolDays.set(new Date("2/24/2023").toLocaleDateString('en-us', dateKeyOptions), "Rodeo Break");
  noSchoolDays.set(new Date("3/17/2023").toLocaleDateString('en-us', dateKeyOptions), "Grading Day");
  noSchoolDays.set(new Date("3/20/2023").toLocaleDateString('en-us', dateKeyOptions), "Spring Break");
  noSchoolDays.set(new Date("3/21/2023").toLocaleDateString('en-us', dateKeyOptions), "Spring Break");
  noSchoolDays.set(new Date("3/22/2023").toLocaleDateString('en-us', dateKeyOptions), "Spring Break");
  noSchoolDays.set(new Date("3/23/2023").toLocaleDateString('en-us', dateKeyOptions), "Spring Break");
  noSchoolDays.set(new Date("3/24/2023").toLocaleDateString('en-us', dateKeyOptions), "Spring Break");
  noSchoolDays.set(new Date("3/30/2023").toLocaleDateString('en-us', dateKeyOptions), "Professional Learning Day");
  noSchoolDays.set(new Date("4/7/2023").toLocaleDateString('en-us', dateKeyOptions), "Spring Holiday");
  noSchoolDays.set(new Date("5/26/2023").toLocaleDateString('en-us', dateKeyOptions), "Grading Day");
}

function getLastDayOfSchool() {
  var lastDay = new Date(Array.from(noSchoolDays.keys()).pop());
  lastDay.setMilliseconds(lastDay.getMilliseconds() - oneDayMilli);
  return lastDay;
}

function isSchoolDay(date) {
  var dayOfWeek = date.getDay();//date.toLocaleDateString('en-us', { weekday: 'long' });
  var firstDay = new Date(noSchoolDays.keys().next().value);
  //console.log(firstDay);
  var lastDay = new Date(Array.from(noSchoolDays.keys()).pop());
  //console.log(lastDay);
  if (date < firstDay) return false;
  if (date > lastDay) return false;
  return !noSchoolDays.has(date.toLocaleDateString('en-us', dateKeyOptions))
    && dayOfWeek != 0 && dayOfWeek != 6;
}

function getEndDateFromSchoolDays(startDate, numDays) {
  var endDate = new Date(startDate.getTime());
  for (var d = 0; d < numDays; d++) {
    endDate.setMilliseconds(endDate.getMilliseconds() + oneDayMilli);
    //console.log(endDate);
    if (!isSchoolDay(endDate)) d--;
    if (endDate.getTime() >= getLastDayOfSchool().getTime()){
      return endDate;
    }
  }
  //console.log(endDate);
  return endDate;
}

function getSchoolDaysUntilNextBreak(date) {
  var days = 0;
  for (var d = new Date(date); !noSchoolDays.has(d.toLocaleDateString('en-us', dateKeyOptions)) && days < 60; d.setMilliseconds(d.getMilliseconds() + oneDayMilli)) {
    if (isSchoolDay(d)) days++;
  }
  //console.log("Days until next break: ", days);
  return days;
}