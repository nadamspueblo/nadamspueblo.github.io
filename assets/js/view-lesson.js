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
var lessonRef;

// Initialize FirebaseUI authentication
const auth = firebase.auth();
var user;
auth.onAuthStateChanged((_user) => {
  if (_user) {
    // User is signed in
    user = _user;

    // Update UI
    document.getElementById("edit-bar").style.display = "flex";
    document.getElementById("user-email").classList.add("hidden");
    document.getElementById("user-password").classList.add("hidden");
    document.getElementById("sign-in-button").classList.add("hidden");
    document.getElementById("sign-out-button").classList.remove("hidden");
    document.getElementById("account-info").innerHTML = user.email;
    console.log("User signed in");

  } else {
    // User is signed out
    // Update UI
    document.getElementById("edit-bar").style.display = "none";
    document.getElementById("user-email").classList.remove("hidden");
    document.getElementById("user-password").classList.remove("hidden");
    document.getElementById("sign-in-button").classList.remove("hidden");
    document.getElementById("sign-out-button").classList.add("hidden");
    document.getElementById("account-info").innerHTML = "";
    console.log("User signed out");
    cancelEdit();
  }
});

// Element references
const unitTitle = document.getElementById("unit-title");
const lessonTitle = document.getElementById("lesson-title");
const dateSpan = document.getElementById("lesson-date");
const objectives = document.getElementById("objectives");
const assessment = document.getElementById("assessment");
const techStandards = document.getElementById("tech-standards");
const academic = document.getElementById("academic-integration");
const profStandards = document.getElementById("prof-standards");
const workBased = document.getElementById("work-based-learning");
const vocab = document.getElementById("vocab");
const agenda = document.getElementById("agenda");
const lab = document.getElementById("lab");
const notes = document.getElementById("notes");
const editBar = document.getElementById("edit-bar");

const editUnitTitle = document.getElementById("edit-unit-title");
const editUnitNum = document.getElementById("edit-unit-num");
const editLessonNum = document.getElementById("edit-lesson-num");
const editLessonTitle = document.getElementById("edit-lesson-title");
const editDuration = document.getElementById("edit-duration");
const editObjectives = document.getElementById("edit-objectives");
const editAssessment = document.getElementById("edit-assessment");
const editTechStandardSelect = document.getElementById("edit-tech-standard-select");
const editTechSubStandardSelect = document.getElementById("edit-tech-substandard-select");
const editAcademic = document.getElementById("edit-academic-integration");
const editProfStandardSelect = document.getElementById("edit-prof-standard-select");
const editProfSubStandardSelect = document.getElementById("edit-prof-substandard-select");
const editWorkBased = document.getElementById("edit-work-based-learning");
const editVocab = document.getElementById("edit-vocab");
const editAgenda = document.getElementById("edit-agenda");
const editLabDuration = document.getElementById("edit-lab-duration");
const editLabTitle = document.getElementById("edit-lab-title");
const editNotes = document.getElementById("edit-notes");
const unitObjSelect = document.getElementById("unit-objective-select");
const unitAssessSelect = document.getElementById("unit-assessment-select");
const unitTechSelect = document.getElementById("unit-tech-select");
const unitAcademSelect = document.getElementById("unit-academic-int-select");
const unitProfSelect = document.getElementById("unit-prof-select");
const unitVocabSelect = document.getElementById("unit-vocab-select");

// Arrays hold db data for editing
var techStandardsData = [], addedTechStandards = [], addedStandardElems = [];
var profStandardsData = [], addedProfStandards = [];
var vocabData = [], addedVocab = [];
var openUnit = {};

var changed = false;
var isBlank = true;

// If url params, load based on that
const urlParams = new URL(window.location.toLocaleString()).searchParams;
var course = urlParams.get('course');
var unitNum = urlParams.get('unit');
var lessonNum = urlParams.get('lesson');
var unitTitleText = urlParams.get("unit-title");
var startInEditMode = urlParams.get("edit");
var dateParam = urlParams.get("date");
var lessonDate;
const displayDateKeyOptions = { year: 'numeric', month: 'long', day: 'numeric' }
if (dateParam) {
  lessonDate = new Date();
  lessonDate.setTime(dateParam);
  dateSpan.innerHTML = lessonDate.toLocaleDateString('en-us', displayDateKeyOptions);
}
if (course && unitNum && lessonNum) {
  unitNum = parseInt(unitNum);
  lessonNum = parseInt(lessonNum);
  lessonRef = db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum);
  if (!unitTitleText) unitTitleText = "Untitled";
  unitTitle.innerHTML = course.toUpperCase() + " Unit " + unitNum + " " + unitTitleText;
  editUnitNum.value = unitNum;
  editUnitTitle.value = unitTitleText;
  lessonTitle.innerHTML = unitNum + "." + lessonNum + " Untitled";
  editLessonNum.value = lessonNum;
  document.title = unitNum + "." + lessonNum + " " + unitTitleText + " - Pueblo HS Computer Science";
  loadUnit();
}
hideEditElements();

// Load unit containing lesson from firebase
function loadUnit() {
  db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons")
    .orderBy("lesson-num")
    .withConverter(lessonConverter)
    .get()
    .then((querySnapShot) => {
      var totalDuration = 0;
      for (var i = 0; i < querySnapShot.docs.length; i++) {
        var lesson = querySnapShot.docs[i].data();
        if (lesson.lessonNum == 0) {
          openUnit.title = lesson.unitTitle;
          openUnit.num = lesson.unitNum;
          openUnit.duration = lesson.duration;
          openUnit.lessons = [];
          if (lesson.startDate) {
            lesson.startDate = getDateThisSchoolYear(new Date(lesson.startDate));
            openUnit.startDate = lesson.startDate;
            lessonDate = openUnit.startDate;
          }
        }
        else {
          lesson.startDate = getEndDateFromSchoolDays(openUnit.startDate, totalDuration);
          totalDuration += lesson.duration;
        }
        openUnit.lessons.push(lesson);
      }
      parseUnitData();
      showLesson();
      if (startInEditMode) {
        editLesson();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Loads lesson from to display
function showLesson() {
  if (!openUnit || !openUnit.lessons) return;
  // Lesson number 0 is the unit plan
  var lesson = openUnit.lessons[lessonNum];

  // Check for new lesson
  if (!lesson) {
    // Set unit title if this is a new
    unitTitle.innerHTML = "Unit " + unitNum + " " + openUnit.title;
    editUnitTitle.value = openUnit.title;
    editUnitNum.value = unitNum;
    if (openUnit.lessons.length > 1) {
      lesson = openUnit.lessons[openUnit.lessons.length - 1];
      lessonDate = getEndDateFromSchoolDays(lesson.startDate, lesson.duration);
    }
    else {
      lessonDate = openUnit.startDate;
    }
    dateSpan.innerHTML = lessonDate.toLocaleDateString('en-us', displayDateKeyOptions);

    // Everything else will have default values
    return;
  }

  isBlank = false;

  // Load lesson header
  document.title = unitNum + "." + lessonNum + " " + lesson.lessonTitle + " - Pueblo HS Computer Science";
  unitTitle.innerHTML = course.toUpperCase() + " Unit " + unitNum + " " + openUnit.title;
  editUnitNum.value = unitNum;
  editUnitTitle.value = openUnit.title;
  lessonTitle.innerHTML = unitNum + "." + lessonNum + " " + lesson.lessonTitle;
  editLessonNum.value = lessonNum;
  if (lessonNum == 0) {
    editLessonTitle.value = "Unit Plan";
    lessonTitle.innerHTML = "Unit Plan";
  }
  else editLessonTitle.value = lesson.lessonTitle;
  editDuration.value = lesson.duration;
  if (lesson.duration > 1) {
    dateSpan.innerHTML = lesson.startDate.toLocaleDateString('en-us', { month: 'long', day: 'numeric' });
    dateSpan.innerHTML += " - ";
    var lessonEndDate = getEndDateFromSchoolDays(lesson.startDate, lesson.duration - 1);
    if (lesson.startDate.getMonth() == lessonEndDate.getMonth()) {
      dateSpan.innerHTML += (lessonEndDate.getDate()) + ", " + lessonEndDate.getFullYear();
    }
    else
      dateSpan.innerHTML += lessonEndDate.toLocaleDateString('en-us', displayDateKeyOptions);
  }
  else {
    dateSpan.innerHTML = lesson.startDate.toLocaleDateString('en-us', displayDateKeyOptions);
  }

  // Load objectives
  if (lesson.objectives) {
    var pre = document.createElement("pre");
    pre.innerHTML = lesson.objectives;
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    objectives.appendChild(pre);
    editObjectives.value = lesson.objectives;
  }

  // If unit plan, load objectives from all lessons
  if (lessonNum == 0) {
    var p = document.createElement("p");
    var lessonObjs = lesson.objectives.split("\n");
    for (var i = 0; i < unitObjectives.length; i++) {
      if (lessonObjs.indexOf(unitObjectives[i]) < 0) {
        p.innerHTML += unitObjectives[i];
        if (i < unitObjectives.length - 1) p.innerHTML += "<br>";
      }
    }
    p.classList.add("data-view");
    p.classList.add("hide-in-edit");
    console.log(p);
    objectives.appendChild(p);
  }

  // Load lesson assessment
  if (lesson.assessment) {
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    pre.innerHTML = lesson.assessment;
    assessment.appendChild(pre);
    editAssessment.value = lesson.assessment;
  }

  // Load academic integration
  if (lesson.academicIntegration) {
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    pre.innerHTML = lesson.academicIntegration;
    academic.appendChild(pre);
    editAcademic.value = lesson.academicIntegration;
  }

  // If unit plan load academic integration from all lessons
  if (lessonNum == 0) {
    var p = document.createElement("p");
    for (var i = 0; i < unitAcademicInt.length; i++) {
      p.innerHTML += unitAcademicInt[i];
      if (i < unitAcademicInt.length - 1) p.innerHTML += "<br>";
    }
    p.classList.add("data-view");
    p.classList.add("hide-in-edit");
    console.log(p);
    academic.appendChild(p);
  }

  // Load work based learning
  if (lesson.workBasedLearning) {
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    pre.innerHTML = lesson.workBasedLearning;
    workBased.appendChild(pre);
    editWorkBased.value = lesson.workBasedLearning;
  }

  // Load agenda, unit plan agenda is each lesson
  if (lessonNum == 0) {
    var totalDays = 1;
    for (var i = 1; i < openUnit.lessons.length; i++) {
      var l = openUnit.lessons[i];
      var a = document.createElement("a");
      a.classList.add("lesson-link");
      a.classList.add("data-view");
      a.classList.add("hide-in-edit");
      a.innerHTML = "Day " + totalDays;
      if (l.duration > 1) {
        a.innerHTML += "-" + (totalDays + l.duration - 1);
      }
      a.innerHTML += ": " + l.lessonTitle;
      a.href = "view-lesson.html?course=" + course + "&unit=" + unitNum + "&lesson=" + i;
      agenda.appendChild(a);
      totalDays += l.duration;
    }
  }
  else if (lesson.agenda) {
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    pre.innerHTML = lesson.agenda;
    agenda.appendChild(pre);
    editAgenda.value = lesson.agenda
  }

  // Load lab, unit plan is all labs
  if (lessonNum == 0) {
    for (var i = 1; i < openUnit.lessons.length; i++) {
      var l = openUnit.lessons[i];
      if (l.labTitle) {
        pre = document.createElement("pre");
        pre.classList.add("data-view");
        pre.classList.add("hide-in-edit");
        pre.innerHTML = l.labDuration + " min: " + l.labTitle;
        lab.appendChild(pre);
      }
    }
  }
  else if (lesson.labTitle) {
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    pre.innerHTML = lesson.labDuration + " min: " + lesson.labTitle;
    editLabTitle.value = lesson.labTitle;
    editLabDuration.value = lesson.labDuration;
    lab.appendChild(pre);
  }

  // Load notes
  if (lesson.notes) {
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.classList.add("hide-in-edit");
    pre.innerHTML = lesson.notes;
    notes.appendChild(pre);
    editNotes.value = lesson.notes;
  }

  // Load tech standards
  techStandardsData = lesson.techStandards;
  for (var x in techStandardsData) {
    const container = document.createElement("div");
    container.classList.add("edit-container");
    var button = document.createElement("div");
    button.classList.add("small-button");
    button.classList.add("btn-color-red");
    button.classList.add("hidden");
    button.innerHTML = "x";
    const value = techStandardsData[x];
    button.addEventListener("click", () => {
      container.remove();
      var index = techStandardsData.indexOf(value);
      if (index !== -1) {
        techStandardsData.splice(index, 1);
      }
    });
    container.appendChild(button);
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.innerHTML = techStandardsData[x];
    container.appendChild(pre);
    techStandards.appendChild(container);
  }
  if (lessonNum == 0) {
    var temp = [];
    for (var i = 1; i < openUnit.lessons.length; i++) {
      var l = openUnit.lessons[i];
      for (s of l.techStandards) {
        if (temp.indexOf(s) < 0) {
          temp.push(s);
          var pre = document.createElement("pre");
          pre.classList.add("data-view");
          pre.innerHTML = s;
          techStandards.appendChild(pre);
        }
      }
    }
  }

  // Load professional standards
  profStandardsData = lesson.profStandards;
  for (var x in profStandardsData) {
    const container = document.createElement("div");
    container.classList.add("edit-container");
    var button = document.createElement("div");
    button.classList.add("small-button");
    button.classList.add("btn-color-red");
    button.classList.add("hidden");
    button.innerHTML = "x";
    const value = profStandardsData[x];
    button.addEventListener("click", () => {
      container.remove();
      var index = profStandardsData.indexOf(value);
      if (index !== -1) {
        profStandardsData.splice(index, 1);
      }
    });
    container.appendChild(button);
    var pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.innerHTML = profStandardsData[x];
    container.appendChild(pre);
    profStandards.appendChild(container);
  }
  if (lessonNum == 0) {
    var temp = [];
    for (var i = 1; i < openUnit.lessons.length; i++) {
      var l = openUnit.lessons[i];
      for (s of l.profStandards) {
        if (temp.indexOf(s) < 0) {
          temp.push(s);
          var pre = document.createElement("pre");
          pre.classList.add("data-view");
          pre.innerHTML = s;
          profStandards.appendChild(pre);
        }
      }
    }
  }

  // Load vocab
  vocabData = lesson.vocab;
  for (var x in vocabData) {
    const container = document.createElement("div");
    container.classList.add("edit-container");
    var button = document.createElement("div");
    button.classList.add("small-button");
    button.classList.add("btn-color-red");
    button.classList.add("hidden");
    button.innerHTML = "x";
    const value = vocabData[x];
    button.addEventListener("click", () => {
      container.remove();
      var index = vocabData.indexOf(value);
      if (index !== -1) {
        vocabData.splice(index, 1);
      }
    });
    container.appendChild(button);
    var details = document.createElement("details");
    var summary = document.createElement("summary");
    var wordData = vocabData[x].split(":");
    summary.innerHTML = wordData[0];
    details.innerHTML = wordData[1];
    details.appendChild(summary);
    details.classList.add("data-view")
    container.appendChild(details);
    vocab.appendChild(container);
  }
  if (lessonNum == 0) {
    var temp = [];
    for (var i = 1; i < openUnit.lessons.length; i++) {
      var l = openUnit.lessons[i];
      for (s of l.vocab) {
        if (temp.indexOf(s) < 0) {
          temp.push(s);
          var details = document.createElement("details");
          var summary = document.createElement("summary");
          var wordData = s.split(":");
          summary.innerHTML = wordData[0];
          details.innerHTML = wordData[1];
          details.appendChild(summary);
          details.classList.add("data-view")
          vocab.appendChild(details);
        }
      }
    }
  }
}

function nextLesson() {
  lessonNum++;
  lessonNum = Math.min(lessonNum, openUnit.lessons.length - 1);
  clearDataAndElements();
  showLesson();
  urlParams.set("lesson", lessonNum);
  var currentState = history.state;
  window.history.replaceState(currentState, "", "view-lesson.html?" + urlParams.toString());
}

function prevLesson() {
  lessonNum--;
  lessonNum = Math.max(lessonNum, 0);
  clearDataAndElements();
  showLesson();
  urlParams.set("lesson", lessonNum);
  var currentState = history.state;
  window.history.replaceState(currentState, "", "view-lesson.html?" + urlParams.toString());
}

// Firebase Authentication
function signIn() {
  email = document.getElementById("user-email");
  password = document.getElementById("user-password");
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
      // Signed in
      user = userCredential.user;
      password.value = "";
      document.getElementById("edit-bar").style.display = "flex";
      if (!lessonRef) {
        editLesson();
      }
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error signing in: ", errorMessage);
    });
}

// Create new lesson
function newLesson() {
  var num = openUnit.lessons.length;
  var url = "view-lesson.html?course=" + course + "&unit=" + unitNum + "&lesson=" + num + "&edit=true";
  window.open(url, '_blank');
}

// Start Edit Mode
function editLesson() {
  if (!user.uid) return;
  showEditElements();
  hideViewElements();
  var button = document.getElementById("new-button");
  button.classList.add("hide-button");

  button = document.getElementById("edit-button");
  button.classList.add("hide-button");

  button = document.getElementById("save-button");
  button.classList.remove("hide-button");

  button = document.getElementById("cancel-button");
  button.classList.remove("hide-button");

  button = document.getElementById("delete-button");
  button.classList.remove("hide-button");

  editBar.classList.add("edit-bar-active");

  loadTechStandards();
  loadProfStandards();
}

// Cancel edit mode
function cancelEdit() {
  console.log(isBlank);
  if (isBlank) window.close();

  hideEditElements();
  showViewElements();

  // Remove added standard elements
  for (index in addedStandardElems) {
    addedStandardElems[index].remove();
  }
  addedProfStandards = [];
  addedTechStandards = [];
  addedVocab = [];

  var button = document.getElementById("new-button");
  button.classList.remove("hide-button");

  button = document.getElementById("edit-button");
  button.classList.remove("hide-button");

  button = document.getElementById("delete-button");
  button.classList.add("hide-button");

  button = document.getElementById("save-button");
  button.classList.add("hide-button");

  button = document.getElementById("cancel-button");
  button.classList.add("hide-button");

  editBar.classList.remove("edit-bar-active");
}

// Save (update/overwrite) lesson 
function saveLesson() {
  if (editUnitNum.value == "") {
    alert("You must enter a unit number");
    return;
  }
  else if (editLessonNum.value == "") {
    alert("You must enter a lesson number");
    return;
  }
  else if (editDuration.value == "" || editDuration.value == "0") {
    alert("Lesson duration must be at least 1 day");
    return;
  }
  unitNum = parseInt(editUnitNum.value);
  lessonNum = parseInt(editLessonNum.value);
  //
  db.collection(course + "-curriculum").doc("unit-" + unitNum).set({
    "unit-num": parseInt(editUnitNum.value),
    "unit-title": editUnitTitle.value
  }, { merge: true })
    .then(() => {
      // add new standards to data
      techStandardsData = techStandardsData.concat(addedTechStandards);
      profStandardsData = profStandardsData.concat(addedProfStandards);
      vocabData = vocabData.concat(addedVocab);
      // Write lesson to database
      db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum).set({
        "teacher-name": "Nathan Adams",
        "cte-program": "Software and App Design",
        "school": "Pueblo High School",
        "unit-num": parseInt(editUnitNum.value),
        "unit-title": editUnitTitle.value,
        "lesson-num": parseInt(editLessonNum.value),
        "lesson-title": editLessonTitle.value,
        "duration": editDuration.value,
        "objectives": editObjectives.value,
        "assessment": editAssessment.value,
        "academic-integration": editAcademic.value,
        "work-based-learning": editWorkBased.value,
        "agenda": editAgenda.value,
        "notes": editNotes.value,
        "tech-standards": techStandardsData,
        "prof-standards": profStandardsData,
        "vocab": vocabData,
        "lab-title": editLabTitle.value,
        "lab-duration": editLabDuration.value,
        "start-date": lessonNum == 0 ? lessonDate.toLocaleDateString('en-us', dateKeyOptions) : ""
      }, { merge: true })
        .then(() => {
          // Update db reference
          lessonRef = db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum);
          changed = false;

          // Clear lists of added items
          addedTechStandards = [];
          addedProfStandards = [];
          addedVocab = [];

          // Update URL params
          urlParams.delete('edit')
          var currentState = history.state;
          window.history.replaceState(currentState, "", "view-lesson.html?" + urlParams.toString());
          startInEditMode = false;

          // Update UI
          document.title = unitNum + "." + lessonNum + " " + editLessonTitle.value + " - Pueblo HS Computer Science";

          // Remove dynamically created data views
          clearDataAndElements();
          //showLesson();
          loadUnit();
          hideEditElements();
          showViewElements();

          var button = document.getElementById("new-button");
          button.classList.remove("hide-button");

          button = document.getElementById("edit-button");
          button.classList.remove("hide-button");

          button = document.getElementById("delete-button");
          button.classList.remove("hide-button");

          button = document.getElementById("save-button");
          button.classList.add("hide-button");

          button = document.getElementById("cancel-button");
          button.classList.add("hide-button");

          editBar.classList.remove("edit-bar-active");
        });

    })
    .catch((error) => {
      alert("Error saving Unit " + unitNum + " lesson " + lessonNum + error);
    });
}

// Delete lesson 
function deleteLesson() {
  if (confirm("Delete lesson?")) {
    db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum).delete()
      .then(() => {
        db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").get()
          .then((querySnapshot) => {
            if (querySnapshot.size <= 1) {
              db.collection(course + "-curriculum").doc("unit-" + unitNum).delete()
                .then(() => {
                  window.location.href = "view-curriculum.html?course=cs1-2";
                });
            }
            else {
              window.location.href = "view-curriculum.html?course=cs1-2";
            }
          });
      })
      .catch((error) => {
        alert("Error removing document: ", error);
      })
  }
}

// Helper functions
function hideEditElements() {
  editUnitTitle.classList.add("hidden");
  editUnitNum.classList.add("hidden");
  editLessonNum.classList.add("hidden");
  editLessonTitle.classList.add("hidden");
  editDuration.classList.add("hidden");
  editObjectives.classList.add("hidden");
  editAssessment.classList.add("hidden");
  editTechStandardSelect.classList.add("hidden");
  editTechSubStandardSelect.classList.add("hidden");
  editAcademic.classList.add("hidden");
  editProfStandardSelect.classList.add("hidden");
  editProfSubStandardSelect.classList.add("hidden");
  editWorkBased.classList.add("hidden");
  editVocab.classList.add("hidden");
  editAgenda.classList.add("hidden");
  editLabDuration.classList.add("hidden");
  editLabTitle.classList.add("hidden");
  editNotes.classList.add("hidden");
  unitObjSelect.classList.add("hidden");
  unitAssessSelect.classList.add("hidden");
  unitTechSelect.classList.add("hidden");
  unitAcademSelect.classList.add("hidden");
  unitProfSelect.classList.add("hidden");
  unitVocabSelect.classList.add("hidden");

  var elems = document.getElementsByClassName("small-button");
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.add("hidden");
  }
  var elems = document.getElementsByClassName("edit-label");
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.add("hidden");
  }
}

function hideViewElements() {
  if (lessonNum == 0) unitTitle.classList.add("hidden");
  lessonTitle.classList.add("hidden");
  var views = document.getElementsByClassName("hide-in-edit");
  for (var i = 0; i < views.length; i++) {
    views[i].classList.add("hidden");
  }
}

function showViewElements() {
  unitTitle.classList.remove("hidden");
  lessonTitle.classList.remove("hidden");
  var views = document.getElementsByClassName("data-view");
  for (var i = 0; i < views.length; i++) {
    views[i].classList.remove("hidden");
  }
}

function showEditElements() {
  if (lessonNum == 0) {
    editUnitTitle.classList.remove("hidden");
    document.getElementById("unit-num-label").classList.remove("hidden");
    editUnitNum.classList.remove("hidden");
  }
  else {
    editLessonNum.classList.remove("hidden");
    document.getElementById("lesson-num-label").classList.remove("hidden");
    editLessonTitle.classList.remove("hidden");
  }
  editObjectives.classList.remove("hidden");
  editAssessment.classList.remove("hidden");
  editTechStandardSelect.classList.remove("hidden");
  //editTechSubStandardSelect.classList.remove("hidden");
  editAcademic.classList.remove("hidden");
  editProfStandardSelect.classList.remove("hidden");
  editWorkBased.classList.remove("hidden");
  editVocab.classList.remove("hidden");
  editAgenda.classList.remove("hidden");
  editLabDuration.classList.remove("hidden");
  editLabTitle.classList.remove("hidden");
  document.getElementById("duration-label").classList.remove("hidden");
  editDuration.classList.remove("hidden");
  editNotes.classList.remove("hidden");
  unitObjSelect.classList.remove("hidden");
  unitAssessSelect.classList.remove("hidden");
  unitTechSelect.classList.remove("hidden");
  unitAcademSelect.classList.remove("hidden");
  unitProfSelect.classList.remove("hidden");
  unitVocabSelect.classList.remove("hidden");

  var elems = document.getElementsByClassName("small-button");
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.remove("hidden");
  }
}

function clearDataAndElements() {
  // Clear values from edit boxes
  editUnitTitle.value = "";
  editUnitNum.value = "";
  editLessonNum.value = "";
  editLessonTitle.value = "";
  editDuration.value = "";
  editObjectives.value = "";
  editAssessment.value = "";
  editAcademic.value = "";
  editWorkBased.value = "";
  editVocab.value = "";
  editAgenda.value = "";
  editNotes.value = "";
  editLabDuration.value = "";
  editLabTitle.value = "";

  var views = document.getElementsByClassName("data-view");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }
  views = document.getElementsByClassName("edit-container");
  for (var i = 0; i < views.length; i++) {
    views[i].remove();
    i--;
  }

  // Clear/set values for display elements
  unitTitle.innerHTML = "Untitled unit";
  lessonTitle.innerHTML = "Unititled lesson";

}

// Organize data from the unit into lists
var unitObjectives = [];
var unitAssessments = [];
var unitTechStandards = [];
var unitAcademicInt = [];
var unitProfStandards = [];
var unitVocab = [];

function parseUnitData() {
  if (!openUnit.lessons) return;
  // Clear previous data
  unitObjectives = [];
  unitAssessments = [];
  unitTechStandards = [];
  unitAcademicInt = [];
  unitProfStandards = [];
  unitVocab = [];

  for (var lesson of openUnit.lessons) {
    var curr = lesson.objectives.split("\n");

    // Parse objectives and load option select
    for (var s of curr) {
      if (unitObjectives.indexOf(s) < 0 && s.length > 1) {
        unitObjectives.push(s);
        var option = document.createElement("option");
        option.text = truncateText(s);
        option.value = s;
        unitObjSelect.appendChild(option);
      }
    }
    unitObjSelect.addEventListener("change", (event) => {
      if (event.target.value.length > 10) {
        if (editObjectives.value.length > 0) editObjectives.value += "\n";
        editObjectives.value += event.target.value;
      }
      unitObjSelect.value = 0;
    });

    // Parse assessment and load option select
    curr = lesson.assessment.split("\n");
    for (var s of curr) {
      s = s.trim();
      if (unitAssessments.indexOf(s) < 0 && s.length > 1) {
        unitAssessments.push(s);
        var option = document.createElement("option");
        option.text = truncateText(s);
        option.value = s;
        unitAssessSelect.appendChild(option);
      }
    }
    unitAssessSelect.addEventListener("change", (event) => {
      if (event.target.value.length > 10) {
        if (editAssessment.value.length > 0) editAssessment.value += "\n";
        editAssessment.value += event.target.value;
      }
      unitAssessSelect.value = 0;
    });

    // Parse tech standards and load option select
    curr = lesson.techStandards;
    for (var s of curr) {
      if (unitTechStandards.indexOf(s) < 0 && s.length > 1) {
        unitTechStandards.push(s);
        var option = document.createElement("option");
        option.text = truncateText(s);
        option.value = s;
        unitTechSelect.appendChild(option);
      }
    }
    unitTechSelect.addEventListener("change", (event) => {
      if (event.target.value.length > 10) {
        //
        handleTechOptionSelect(event);
      }
      unitTechSelect.value = 0;
    });

    // Parse academic integration and load option select
    curr = lesson.academicIntegration.split("\n");
    for (var s of curr) {
      s = s.trim();
      if (unitAcademicInt.indexOf(s) < 0 && s.length > 1) {
        unitAcademicInt.push(s);
        var option = document.createElement("option");
        option.text = truncateText(s);
        option.value = s;
        unitAcademSelect.appendChild(option);
      }
    }
    unitAcademSelect.addEventListener("change", (event) => {
      if (event.target.value.length > 10) {
        if (editAcademic.value.length > 0) editAcademic.value += "\n";
        editAcademic.value += event.target.value;
      }
      unitAcademSelect.value = 0;
    });

    // Parse prof standards and load option select
    curr = lesson.profStandards;
    for (var s of curr) {
      if (unitProfStandards.indexOf(s) < 0 && s.length > 1) {
        unitProfStandards.push(s);
        var option = document.createElement("option");
        option.text = truncateText(s);
        option.value = s;
        unitProfSelect.appendChild(option);
      }
    }
    unitProfSelect.addEventListener("change", (event) => {
      if (event.target.value.length > 10) {
        handleProfOptionSelect(event);
      }
      unitProfSelect.value = 0;
    });

    // Parse work-based integration and load option select

    // Parse vocab and load option select
    curr = lesson.vocab;
    for (var s of curr) {
      if (unitVocab.indexOf(s) < 0 && s.length > 1) {
        unitVocab.push(s);
        var option = document.createElement("option");
        option.text = truncateText(s);
        option.value = s;
        unitVocabSelect.appendChild(option);
      }
    }
    unitVocabSelect.addEventListener("change", (event) => {
      if (event.target.value.length > 10) {
        addVocab(event.target.value);
      }
      unitVocabSelect.value = 0;
    });

  }
}

// Add vocab word to the list
function addVocabClick() {
  const value = editVocab.value;
  if (value != undefined && value != "") {
    editVocab.value = "";
    addVocab(value);
  }
}

function addVocab(value) {
  if (vocabData.indexOf(value) >= 0 || addedVocab.indexOf(value) >= 0) return;
  const container = document.createElement("div");
  container.classList.add("edit-container");
  var button = document.createElement("div");
  button.classList.add("small-button");
  button.classList.add("btn-color-red");
  button.innerHTML = "x";
  button.addEventListener("click", (event) => {
    container.remove();
    var index = vocabData.indexOf(value);
    if (index !== -1) {
      vocabData.splice(index, 1);
    }
  });
  container.appendChild(button);
  var details = document.createElement("details");
  var summary = document.createElement("summary");
  var wordData = value.split(":");
  summary.innerHTML = wordData[0];
  details.innerHTML = wordData[1];
  details.appendChild(summary);
  details.classList.add("data-view")
  container.appendChild(details);
  vocab.appendChild(container);

  // Track added vocab/elements to remove if edit is canceled
  addedStandardElems.push(container);
  addedVocab.push(value);

}

// Load tech standards from db
function loadTechStandards() {
  // If standards have been loaded already, return
  if (editTechStandardSelect.childElementCount > 3) return;

  db.collection("tech-standards").orderBy("number")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        var option = document.createElement("option");
        option.text = doc.data()["title"];
        option.value = doc.id;
        editTechStandardSelect.appendChild(option);

      });

    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  editTechStandardSelect.addEventListener("change", (event) => {
    db.collection("tech-standards").doc(event.target.value)
      .get()
      .then((doc) => {
        // Remove all elements
        while (editTechSubStandardSelect.firstChild) {
          editTechSubStandardSelect.removeChild(editTechSubStandardSelect.lastChild);
        }
        // Add default option
        var defaultOption = document.createElement("option");
        defaultOption.value = 0;
        defaultOption.text = "Select standard";
        editTechSubStandardSelect.appendChild(defaultOption);
        for (var x in doc.data()) {
          if (x != "title" && x != "number") {
            var option = document.createElement("option");
            option.value = doc.data()["number"] + "." + x + " " + doc.data()[x];
            option.text = truncateText(option.value);
            editTechSubStandardSelect.appendChild(option);
          }
        }
        editTechSubStandardSelect.classList.remove("hidden");

      });


  });

  editTechSubStandardSelect.addEventListener("change", handleTechOptionSelect);
}

// handle tech standard option change
function handleTechOptionSelect(event) {
  //console.log(event.target.value);
  var text = event.target.value;
  // don't add if already on the list
  var index = techStandardsData.concat(addedTechStandards).indexOf(text);
  if (index > -1) {
    techStandards.children[index + 4].classList.add("highlight-red");
    setTimeout(() => {
      techStandards.children[index + 4].classList.remove("highlight-red");
    }, 1000);
    editTechSubStandardSelect.value = 0;
    return;
  }
  addedTechStandards.push(text);
  const container = document.createElement("div");
  addedStandardElems.push(container);
  container.classList.add("edit-container");
  var button = document.createElement("div");
  button.classList.add("small-button");
  button.classList.add("btn-color-red");
  button.innerHTML = "x";
  const value = text;
  button.addEventListener("click", () => {
    container.remove();
    var index = techStandardsData.indexOf(value);
    if (index !== -1) {
      techStandardsData.splice(index, 1);
    }
    index = addedTechStandards.indexOf(value);
    if (index !== -1) {
      addedTechStandards.splice(index, 1);
    }
    console.log(techStandardsData);
  });
  container.appendChild(button);
  pre = document.createElement("pre");
  pre.classList.add("data-view");
  pre.innerHTML = text;
  container.appendChild(pre);
  techStandards.appendChild(container);
  container.classList.add("highlight-green");
  setTimeout(() => {
    techStandards.children[profStandards.children.length - 1].classList.remove("highlight-green");
  }, 1000);
  editTechSubStandardSelect.value = 0;
}

// Load prof standards from db
function loadProfStandards() {
  // If standards have been loaded already, return
  if (editProfStandardSelect.childElementCount > 3) return;

  // Load prof standards into select element from Firestore
  db.collection("prof-standards").orderBy("number")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var option = document.createElement("option");
        option.text = doc.data()["title"];
        option.value = doc.id;
        editProfStandardSelect.appendChild(option);
      });

    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  editProfStandardSelect.addEventListener("change", (event) => {
    db.collection("prof-standards").doc(event.target.value)
      .get()
      .then((doc) => {
        // Remove all elements
        while (editProfSubStandardSelect.firstChild) {
          editProfSubStandardSelect.removeChild(editProfSubStandardSelect.lastChild);
        }
        // Add default option
        var defaultOption = document.createElement("option");
        defaultOption.value = 0;
        defaultOption.text = "Select standard";
        editProfSubStandardSelect.appendChild(defaultOption);
        for (var x in doc.data()) {
          if (x != "title" && x != "number") {
            var option = document.createElement("option");
            option.value = doc.data()["number"] + "." + x + " " + doc.data()[x];
            option.text = truncateText(option.value);
            editProfSubStandardSelect.appendChild(option);
          }
        }
        editProfSubStandardSelect.classList.remove("hidden");

      });


  });

  editProfSubStandardSelect.addEventListener("change", handleProfOptionSelect);
}

function handleProfOptionSelect(event) {
  //console.log(event.target.value);
  var text = event.target.value;
  // don't add if already on the list
  const index = profStandardsData.concat(addedProfStandards).indexOf(text);
  if (index > -1) {
    profStandards.children[index + 4].classList.add("highlight-red");
    setTimeout(() => {
      profStandards.children[index + 4].classList.remove("highlight-red");
    }, 1000);
    editProfSubStandardSelect.value = 0;
    return;
  }
  addedProfStandards.push(text);
  const container = document.createElement("div");
  addedStandardElems.push(container);
  container.classList.add("edit-container");
  var button = document.createElement("div");
  button.classList.add("small-button");
  button.classList.add("btn-color-red");
  button.innerHTML = "x";
  const value = text;
  button.addEventListener("click", () => {
    container.remove();
    var index = profStandardsData.indexOf(value);
    if (index !== -1) {
      profStandardsData.splice(index, 1);
    }
    index = addedProfStandards.indexOf(value);
    if (index !== -1) {
      addedProfStandards.splice(index, 1);
    }
  });
  container.appendChild(button);
  pre = document.createElement("pre");
  pre.classList.add("data-view");
  pre.innerHTML = text;
  container.appendChild(pre);
  profStandards.appendChild(container);
  container.classList.add("highlight-green");
  setTimeout(() => {
    profStandards.children[profStandards.children.length - 1].classList.remove("highlight-green");
  }, 1000);
  editProfSubStandardSelect.value = 0;
}

function truncateText(text, maxLength = 100) {
  if (text.length > maxLength) {
    var result = text.substring(0, maxLength);
    var truncIndex = result.lastIndexOf(" ");
    result = result.substring(0, truncIndex);
    if (result.length < text.length) result += " ...";
    return result;
  }
  return text;
}