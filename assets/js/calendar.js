// Initialize Firebase Store
firebase.initializeApp({
  apiKey: "AIzaSyDZ8fhLVmOVay80Y33LAEVBopns1k-Fytg",
  authDomain: "pueblo-cs-website.firebaseapp.com",
  projectId: "pueblo-cs-website",
  storageBucket: "pueblo-cs-website.appspot.com",
  messagingSenderId: "528094862817",
  appId: "1:528094862817:web:2f8468a947f9161ff846a0",
  measurementId: "G-85Z0RPVRNR"
});

const db = firebase.firestore();

const urlParams = new URL(window.location.toLocaleString()).searchParams;
var course = urlParams.get('course');

const calendarContainer = document.getElementById("calendar-container");
const calendarBg = document.getElementById("month-bg");
const lessonContainer = document.getElementById("lesson-container");
const unitContainer = document.getElementById("unit-container");
addEventListener("resize", (event) => {
  unitContainer.style.maxWidth = calendarBg.offsetWidth + "px";
  unitContainer.style.minWidth = calendarBg.offsetWidth + "px";
  lessonContainer.style.maxWidth = calendarBg.offsetWidth + "px";
  lessonContainer.style.minWidth = calendarBg.offsetWidth + "px";
});

// Set calendar to display dates for the given month 0 = Jan
const monthDiv = document.getElementById("month-bg");
const firstDay = new Date("Auguts 4, 2022");//new Date(Date.now())
const noSchoolDays = new Map();
const oneDayMilli = 24 * 60 * 60 * 1000;
const dateKeyOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
var calendarStartDate, calendarEndDate, nextOpenDate;
var displayMonth = 7;
var totalLessonDays = 0;
setNoSchoolDays();
loadMonth();

//getEndDateFromSchoolDays(new Date("8/4/2022"), 16);
console.log(isSchoolDay(nextOpenDate));

function setDisplayDates(month) {
  var year = firstDay.getFullYear();
  if (month < 6) year += 1;
  var startDate = new Date((month + 1) + "/1/" + year);
  document.getElementById("month-name").innerHTML = startDate.toLocaleDateString("en-us", { month: 'long', year: 'numeric' });
  var day = new Date(startDate);
  day.setDate(startDate.getDate() - (startDate.getDay() - 1));
  calendarStartDate = new Date(day);
  nextOpenDate = new Date(day);
  for (var i = 0; i < 25; i++) {
    var div = document.createElement("div");
    div.classList.add("day");
    var h3 = document.createElement("h3");
    var dateSpan = document.createElement("span");
    dateSpan.classList.add("date");
    dateSpan.innerHTML = day.getDate();
    h3.appendChild(dateSpan);
    var daySpan = document.createElement("span");
    daySpan.classList.add("day-name");
    daySpan.innerHTML = day.toLocaleDateString("en-us", { weekday: 'long' });
    h3.appendChild(daySpan)
    div.appendChild(h3);
    monthDiv.appendChild(div);

    if (day.getDay() == 5) day.setDate(day.getDate() + 3);
    else day.setDate(day.getDate() + 1);
  }
  calendarEndDate = day;
}

function getSchoolDaysBetween(date1, date2) {
  var days = 0;
  for (var d = new Date(date1.getTime()); d <= date2; d.setMilliseconds(d.getMilliseconds() + oneDayMilli)) {
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
  for (var d = 1; d < numDays; d++) {
    endDate.setMilliseconds(endDate.getMilliseconds() + oneDayMilli);
    //console.log(endDate);
    if (!isSchoolDay(endDate)) d--;
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

function advanceNextOpenDate(days = 1) {
  //console.log("Advancing day by ", days, " start date ", nextOpenDate);
  nextOpenDate.setMilliseconds(nextOpenDate.getMilliseconds() + oneDayMilli * days);
  if (nextOpenDate.getDay() == 6) {
    nextOpenDate.setMilliseconds(nextOpenDate.getMilliseconds() + 2 * oneDayMilli);
  }
  else if (nextOpenDate.getDay() == 0) {
    nextOpenDate.setMilliseconds(nextOpenDate.getMilliseconds() + oneDayMilli);
  }
  //console.log("Advancing day by ", days, " end date ", nextOpenDate);
}

// Line up calendar elements
unitContainer.style.maxWidth = calendarBg.offsetWidth + "px";
unitContainer.style.minWidth = calendarBg.offsetWidth + "px";
lessonContainer.style.maxWidth = calendarBg.offsetWidth + "px";
lessonContainer.style.minWidth = calendarBg.offsetWidth + "px";
calendarContainer.style.minHeight = calendarBg.offsetHeight + "px";
var colors = ["cornflowerblue", "goldenrod"];
var unitStartDate;

function nextMonth(){
  displayMonth++;
  displayMonth %= 12;
  if (!(displayMonth > 4 && displayMonth < 7))
    loadMonth();
  else if (displayMonth == 5)
    displayMonth = 4;
}

function prevMonth(){
  displayMonth--;
  if (displayMonth < 0) displayMonth = 11;
  displayMonth %= 12;
  console.log(displayMonth);
  if (!(displayMonth > 5 && displayMonth < 7))
    loadMonth();
  else if (displayMonth == 6)
    displayMonth = 7;
}

function loadMonth() {
  clearCalendar();
  setDisplayDates(displayMonth);
  db.collection(course + "-curriculum")
    .orderBy("unit-num")
    .get()
    .then((querySnapShot) => {
      unitStartDate = new Date(nextOpenDate.getTime());
      // Fill no-school days at start of calendar
      while (!isSchoolDay(nextOpenDate)) {
        addNoSchoolDay();
        totalLessonDays++;
        advanceNextOpenDate();
      }
      querySnapShot.forEach((doc) => {
        loadLessons(doc.data()["unit-num"]);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadLessons(unit) {
  db.collection(course + "-curriculum").doc("unit-" + unit).collection("lessons")
    .orderBy("lesson-num")
    .get()
    .then((querySnapShot) => {
      // Set number of columns depending on screen size
      var cols = 2;
      var screen = window.matchMedia("(min-width: 740px)");
      if (screen.matches) cols = 5;
      
      querySnapShot.forEach((doc) => {
        // Determine if unit fits within current calendar
        var days = 0;
        if (doc.data()["lesson-num"] == 0) {
          if (doc.data()["start-date"] != undefined) {
            unitStartDate = new Date(doc.data()["start-date"]);
          }
        }
        var unitLength = parseInt(doc.data()["duration"]);
        var unitEndDate = getEndDateFromSchoolDays(unitStartDate, unitLength);
        if (unitEndDate > nextOpenDate && unitStartDate <= calendarEndDate) {
          // Calc how many days fit on the calendar
          days = getSchoolDaysBetween(nextOpenDate, unitEndDate);

          for (var i = 0; totalLessonDays < 25 && i < days;) {
            var div = document.createElement("div");
            var daysTilBreak = Math.min(cols, getSchoolDaysUntilNextBreak(nextOpenDate));

            if (daysTilBreak > 0) {
              var freeSpace = Math.min(daysTilBreak, Math.abs(cols - totalLessonDays % cols));
              freeSpace = Math.min(freeSpace, days - i);
              div.style.gridColumnStart = "span " + freeSpace;
              i += freeSpace;
              totalLessonDays += freeSpace;
              advanceNextOpenDate(freeSpace);
              if (doc.data()["lesson-num"] == 0) {
                var link = document.createElement("a");
                link.innerHTML = "Unit " + doc.data()["unit-num"] + " " + doc.data()["unit-title"]; 
                link.href = "view-lesson.html?course=cs1-2&unit=" + doc.data()["unit-num"] + "&lesson=0";
                div.appendChild(link);
                div.classList.add("unit");
                div.style.backgroundColor = colors[unit % colors.length];
                unitContainer.appendChild(div);
              }
              else {
                div.innerHTML = doc.data()["unit-num"] + "." + doc.data()["lesson-num"] + " " + doc.data()["lesson-title"];
                div.classList.add("lesson");
                lessonContainer.appendChild(div);
              }
            }
            if (daysTilBreak == 0) {
              //console.log("No school, next open date: ", nextOpenDate);
              addNoSchoolDay(noSchoolDays.get(nextOpenDate.toLocaleDateString('en-us', {year: 'numeric', month:'numeric', day:'numeric'})));
              advanceNextOpenDate();
              totalLessonDays++;
              //days++;
            }
          }
        }
        unitStartDate = new Date(unitEndDate.getTime() + oneDayMilli);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function addEmptyLesson(length = 1) {
  var div = document.createElement("div");
  div.classList.add("no-school");
  div.style.gridColumnStart = "span " + length;
  lessonContainer.appendChild(div);
}

function addNoSchoolDay(text = "No School", length = 1) {
  var div = document.createElement("div");
  div.innerHTML = text;
  div.classList.add("no-school");
  div.style.gridColumnStart = "span " + length;
  unitContainer.appendChild(div);
}

function clearCalendar() {
  var views = document.getElementsByClassName("lesson");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }

  views = document.getElementsByClassName("unit");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }

  views = document.getElementsByClassName("no-school");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }
  
  views = document.getElementsByClassName("day");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }

  totalLessonDays = 0;
}
