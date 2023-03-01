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
if (!course) course = "cs1-2";
document.getElementById("heading").innerHTML = course.toUpperCase() + " Calendar";

// Initialize FirebaseUI authentication
const auth = firebase.auth();
var user;
auth.onAuthStateChanged((_user) => {
  if (_user) {
    // User is signed in
    user = _user;

    // Update UI
    document.getElementById("user-email").classList.add("hidden");
    document.getElementById("user-password").classList.add("hidden");
    document.getElementById("sign-in-button").classList.add("hidden");
    document.getElementById("sign-out-button").classList.remove("hidden");
    document.getElementById("account-info").innerHTML = user.email;

    createAddUnitButton();

    console.log("User signed in");

  } else {
    // User is signed out
    // Update UI
    document.getElementById("user-email").classList.remove("hidden");
    document.getElementById("user-password").classList.remove("hidden");
    document.getElementById("sign-in-button").classList.remove("hidden");
    document.getElementById("sign-out-button").classList.add("hidden");
    document.getElementById("account-info").innerHTML = "";

    removeAddUnitButton();
    var elems = document.getElementsByClassName("new-lesson-button");
    for (e of elems) {
      e.remove();
    }
    console.log("User signed out");
  }
});

function signIn() {
  email = document.getElementById("user-email");
  password = document.getElementById("user-password");
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
      password.value = "";
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error signing in: ", errorMessage);
    });
}

const calendarContainer = document.getElementById("calendar-container");
const calendarBg = document.getElementById("month-bg");
const lessonContainer = document.getElementById("lesson-container");
const unitContainer = document.getElementById("unit-container");
addEventListener("resize", (event) => {
  unitContainer.style.maxWidth = calendarBg.offsetWidth + "px";
  unitContainer.style.minWidth = calendarBg.offsetWidth + "px";
  
  var dayElem = document.getElementById("0");
  dayElemHeight = dayElem.offsetHeight;
  headingHeight = dayElem.children[0].offsetHeight;

  for (var e of document.getElementsByClassName("unit")) {
    e.style.height = (dayElemHeight - headingHeight) + "px";
    e.style.marginTop = (headingHeight + 1) + "px";
  }
});

// Set calendar to display dates for the given month 0 = Jan
const monthDiv = document.getElementById("month-bg");
const firstDayOfSchool = new Date("August 4, 2022");
const noSchoolDays = new Map();
const oneDayMilli = 24 * 60 * 60 * 1000;
const dateKeyOptions = { year: 'numeric', month: 'numeric', day: 'numeric' }
var calendarStartDate, calendarEndDate, nextOpenDate;
var now = new Date(Date.now());
var displayMonth = now.getMonth();
if (urlParams.get('month')) {
  displayMonth = parseInt(urlParams.get('month'));
}
let currentState = history.state;
var totalLessonDays = 0;
var dayElemHeight, headingHeight;
setNoSchoolDays();
loadCurriculum();



function setDisplayDates(month) {
  var year = firstDayOfSchool.getFullYear();
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
    div.id = i;
    monthDiv.appendChild(div);

    if (day.getDay() == 5) day.setDate(day.getDate() + 3);
    else day.setDate(day.getDate() + 1);
  }
  calendarEndDate = day;
  var dayElem = document.getElementById("0");
  dayElemHeight = dayElem.offsetHeight;
  headingHeight = dayElem.children[0].offsetHeight;
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
calendarContainer.style.minHeight = calendarBg.offsetHeight + "px";
var colors = ["cornflowerblue", "goldenrod"];
var unitStartDate;
var units = new Map(), lessons = [];
var lastUnitNum = 0;

function nextMonth() {
  displayMonth++;
  displayMonth %= 12;
  if (!(displayMonth > 4 && displayMonth < 7))
    fillCalendar();
  else if (displayMonth == 5)
    displayMonth = 4;
  urlParams.set("month", displayMonth);
  window.history.replaceState(currentState, "month " + displayMonth, "calendar.html?" + urlParams.toString());
  window.scrollTo(0, 0);
}

function prevMonth() {
  displayMonth--;
  if (displayMonth < 0) displayMonth = 11;
  displayMonth %= 12;
  if (!(displayMonth > 5 && displayMonth < 7))
    fillCalendar();
  else if (displayMonth == 6)
    displayMonth = 7;
  urlParams.set("month", displayMonth);
  window.history.replaceState(currentState, "month " + displayMonth, "calendar.html?" + urlParams.toString());
  window.scrollTo(0, 0);
}

function loadCurriculum() {
  clearCalendar();
  setDisplayDates(displayMonth);
  db.collection(course + "-curriculum")
    .orderBy("unit-num")
    .get()
    .then((querySnapShot) => {
      unitStartDate = new Date(firstDayOfSchool.getTime());
      for (var i = 0; i < querySnapShot.docs.length; i++) {
        var doc = querySnapShot.docs[i];
        loadLessons(parseInt(doc.data()["unit-num"]), i == querySnapShot.docs.length - 1);
      };
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadLessons(unit, last = false) {
  db.collection(course + "-curriculum").doc("unit-" + unit).collection("lessons")
    .orderBy("lesson-num").withConverter(lessonConverter)
    .get()
    .then((querySnapShot) => {
      for (var i = 0; i < querySnapShot.docs.length; i++) {
        var lesson = querySnapShot.docs[i].data();
        //unitStartDate = new Date(unitEndDate.getTime() + oneDayMilli);
        if (lesson.lessonNum == 0) {
          units.set(unit, lesson);
        }
        else {
          units.get(unit).lessons.push(lesson);
        }
        if (last && i == querySnapShot.docs.length - 1) {
          fillCalendar();
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function addEmptyLesson(length = 1) {
  var div = document.createElement("div");
  div.classList.add("empty-lesson");
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

function fillCalendar() {
  clearCalendar();
  setDisplayDates(displayMonth);
  unitStartDate = new Date(nextOpenDate.getTime());
  fillUnitGrid();
  if (user && totalLessonDays < 25) {
    createAddUnitButton();
  }
  // Reset counters
  nextOpenDate = new Date(calendarStartDate.getTime());
  totalLessonDays = 0;
  fillLessons();
}

function fillUnitGrid() {
  // Fill no-school days at start of calendar
  while (!isSchoolDay(nextOpenDate)) {
    addNoSchoolDay(noSchoolDays.get(nextOpenDate.toLocaleDateString('en-us', dateKeyOptions)));
    totalLessonDays++;
    advanceNextOpenDate();
  }

  // Set number of columns depending on screen size
  var cols = 2;
  var screen = window.matchMedia("(min-width: 740px)");
  if (screen.matches) cols = 5;

  for (var [key, unit] of units) {
    // Determine if unit fits within current calendar
    var days = 0;
    if (unit.startDate != undefined) {
      unitStartDate = new Date(unit.startDate);
    }
    else {
      unit.startDate = unitStartDate.toLocaleDateString('en-us', dateKeyOptions);
    }
    var unitLength = unit.duration;
    var unitEndDate = getEndDateFromSchoolDays(unitStartDate, unitLength);
    unit.endDate = unitEndDate.toLocaleDateString('en-us', dateKeyOptions);
    unit.elements = [];
    if (unitEndDate > nextOpenDate && unitStartDate <= calendarEndDate) {
      // Calc how many days fit on the calendar
      days = getSchoolDaysBetween(nextOpenDate, unitEndDate);

      // Store unit num to use in add unit link
      lastUnitNum = key;

      for (var i = 0; totalLessonDays < 25 && i < days;) {
        var div = document.createElement("div");
        var daysTilBreak = Math.min(cols, getSchoolDaysUntilNextBreak(nextOpenDate));

        if (daysTilBreak > 0) {
          var freeSpace = Math.min(daysTilBreak, Math.abs(cols - totalLessonDays % cols));
          freeSpace = Math.min(freeSpace, days - i);
          // Add unit element
          div.style.gridColumnStart = "span " + freeSpace;
          var link = document.createElement("a");
          link.innerHTML = "Unit " + unit.unitNum + " " + unit.unitTitle;
          link.href = "view-lesson.html?course=cs1-2&unit=" + unit.unitNum + "&lesson=0";
          div.appendChild(link);
          div.classList.add("unit");
          var grid = document.createElement("div");
          grid.style.display = "grid";
          grid.style.height = "100%";
          //grid-template-columns: repeat(2, minmax(100px, 1fr));
          grid.style.gridTemplateColumns = "repeat(" + freeSpace + ", minmax(100px, 1fr))";
          div.appendChild(grid);
          div.style.backgroundColor = colors[unit.unitNum % colors.length];
          div.style.height = (dayElemHeight - headingHeight) + "px";
          div.style.marginTop = (headingHeight + 1) + "px";
          unitContainer.appendChild(div);
          unit.elements.push(div);

          i += freeSpace;
          totalLessonDays += freeSpace;
          advanceNextOpenDate(freeSpace);
        }
        if (daysTilBreak == 0) {
          addNoSchoolDay(noSchoolDays.get(nextOpenDate.toLocaleDateString('en-us', dateKeyOptions)));
          advanceNextOpenDate();
          totalLessonDays++;
        }
      }
    }
    unitStartDate = new Date(unitEndDate.getTime());
  }
  // Fill no-school days at end of calendar
  while (!isSchoolDay(nextOpenDate)) {
    addNoSchoolDay(noSchoolDays.get(nextOpenDate.toLocaleDateString('en-us', dateKeyOptions)));
    totalLessonDays++;
    advanceNextOpenDate();
  }
}

function fillLessons() {
  for (var [key, unit] of units) {
    // Determine if unit is visible
    var visibleLength = getSchoolDaysBetween(nextOpenDate, new Date(unit.endDate));
    console.log("Unit end date ", unit.endDate);

    // If visible, determine how many days are visible
    if (visibleLength > 0) {

      // Determine which lesson corresponds to the first visible day
      var daysToSkip = unit.duration - visibleLength;
      var indexToStart = 0;
      for (var i = 0; i < unit.lessons.length && daysToSkip > 0; i++) {
        var lesson = unit.lessons[i];
        if (lesson.duration <= daysToSkip) {
          indexToStart = i;
          daysToSkip -= lesson.duration;
        }
        else {
          indexToStart = i;// + (lesson.duration - daysToSkip) / lesson.duration;
        }
      }

      // The remainder of days after filling a unit element with a lesson (likely over 2+ days)
      var remDays = 0;

      // For each unit element add as many lessons as will fit 
      for (e of unit.elements) {

        // Determine space element holds
        var freeSpace = Math.round(e.offsetWidth / document.getElementById("0").offsetWidth);

        // Add lessons
        for (; indexToStart < unit.lessons.length && freeSpace > 0; indexToStart++) {
          var lesson = unit.lessons[indexToStart];
          remDays = remDays > 0 ? remDays : lesson.duration;
            var div = document.createElement("div");
            var a = document.createElement("a");
            a.href = "view-lesson.html?course=cs1-2&unit=" + lesson.unitNum + "&lesson=" + lesson.lessonNum;
            //a.innerHTML = lesson.unitNum + "." + lesson.lessonNum + " " + lesson.lessonTitle;
            var h4 = document.createElement("h4");
            h4.style.margin = "0px";
            h4.style.borderBottom = "1px solid";
            h4.style.whiteSpace = "nowrap";
            h4.style.overflow = "hidden";
            a.innerHTML = lesson.unitNum + "." + lesson.lessonNum + " " + lesson.lessonTitle;
            h4.appendChild(a);
            div.appendChild(h4);
            if (lesson.labTitle) {
              var p = document.createElement("p");
              p.innerHTML = "Lab: " + lesson.labTitle;
              p.style.marginBottom = "0px";
              p.style.marginTop = "4px";
              div.appendChild(p);
              var minBar = document.createElement("div");
              minBar.classList.add("progress-bar");
              var totalMin = lesson.duration % 2 == 1 ? Math.min(freeSpace, remDays) * 50 : Math.min(freeSpace, remDays) * 45;
              minBar.style.maxWidth = (100 * lesson.labDuration / Math.min(freeSpace, remDays) / totalMin) + "%";
              minBar.innerHTML = lesson.labDuration + " min";
              div.appendChild(minBar);
            }
            div.classList.add("lesson");
            div.style.gridColumnStart = "span " + Math.min(remDays, freeSpace);
            
            var grid = e.children[1];
            grid.appendChild(div);
          if (remDays > freeSpace){
            remDays -= freeSpace;
            freeSpace = 0;
            indexToStart--;
          }
          else {
            freeSpace -= remDays;
            remDays = 0;
          }
        }

        // Add new lesson button if still a free space
        if (freeSpace > 0) {
          const elem = e;
          const div = document.createElement("div");
          div.classList.add("new-lesson-button");
          div.style.color = elem.style.backgroundColor;
          div.innerHTML = "+";
          div.classList.add("hidden");
          div.addEventListener("click", () => {
            if (auth.currentUser) {
              window.location.href = "view-lesson.html?course=" + course + "&unit=" + unit.unitNum + "&lesson=" + (unit.lessons.length + 1);
            }
          });
          div.addEventListener("mouseenter", (ev) => {
            if (auth.currentUser) {
              div.style.cursor = "pointer";
              div.style.color = "white";
              div.style.border = "2px solid";
            }
          });
          div.addEventListener("mouseleave", (ev) => {
            if (auth.currentUser) {
              div.style.color = elem.style.backgroundColor;
              div.style.border = "2px solid";
            }
            div.style.cursor = "arrow";
          });
          var grid = e.children[1];
          grid.appendChild(div);
        }
      }

    }

  }
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

  views = document.getElementsByClassName("empty-lesson");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }

  views = document.getElementsByClassName("new-unit-button");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }

  totalLessonDays = 0;
}

function createAddUnitButton() {
  if (document.getElementsByClassName("new-unit-button").length > 0 || totalLessonDays >= 25 || units.size == 0) return;
  var div = document.createElement("div");
  div.classList.add("new-unit-button");
  div.classList.add("has-account");
  div.innerHTML = "+";
  div.classList.add("hidden");
  div.addEventListener("click", () => {
    window.location.href = "view-lesson.html?course=" + course + "&unit=" + (lastUnitNum + 1) + "&lesson=0";
  });
  unitContainer.appendChild(div);
}

function removeAddUnitButton() {
  var elems = document.getElementsByClassName("new-unit-button");
  for (e of elems) {
    e.remove();
  }
}
