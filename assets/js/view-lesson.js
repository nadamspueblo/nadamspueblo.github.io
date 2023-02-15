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
const objectives = document.getElementById("objectives");
const assessment = document.getElementById("assessment");
const techStandards = document.getElementById("tech-standards");
const academic = document.getElementById("academic-integration");
const profStandards = document.getElementById("prof-standards");
const workBased = document.getElementById("work-based-learning");
const vocab = document.getElementById("vocab");
const agenda = document.getElementById("agenda");
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
const editAcademic = document.getElementById("edit-academic-integration");
const editProfStandardSelect = document.getElementById("edit-prof-standard-select");
const editWorkBased = document.getElementById("edit-work-based-learning");
const editVocab = document.getElementById("edit-vocab");
const editAgenda = document.getElementById("edit-agenda");
const editNotes = document.getElementById("edit-notes");

// Arrays hold db data for editing
var techStandardsData = [];
var profStandardsData = [];
var vocabData = [];

var changed = false;

// If url params, load based on that
const urlParams = new URL(window.location.toLocaleString()).searchParams;
var course = urlParams.get('course');
var unitNum = urlParams.get('unit');
var lessonNum = urlParams.get('lesson');
var unitTitleText = urlParams.get("unit-title");
if (course && unitNum && lessonNum) {
  lessonRef = db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum);
  if (!unitTitleText) unitTitleText = "Untitled"
  unitTitle.innerHTML = "Unit " + unitNum + " " + unitTitleText;
  editUnitNum.value = unitNum;
  editUnitTitle.value = unitTitleText;
  lessonTitle.innerHTML = unitNum + "." + lessonNum + " Untitled";
  editLessonNum.value = lessonNum;
  loadLesson();
}
hideEditElements();

// Loads lesson from db to display
function loadLesson() {
  if (lessonRef) {
    lessonRef.get().then((doc) => {
      unitNum = doc.data()['unit-num'];
      lessonNum = doc.data()['lesson-num']
      unitTitle.innerHTML = "Unit " + unitNum + " " + doc.data()['unit-title'];
      editUnitNum.value = unitNum;
      editUnitTitle.value = doc.data()['unit-title'];
      lessonTitle.innerHTML = unitNum + "." + lessonNum + " " + doc.data()['lesson-title'];
      editLessonNum.value = lessonNum;
      editLessonTitle.value = doc.data()['lesson-title'];
      editDuration.value = doc.data()['duration'];

      var pre = document.createElement("pre");
      pre.innerHTML = doc.data()['objectives'];
      pre.classList.add("data-view");
      pre.classList.add("hide-in-edit");
      objectives.appendChild(pre);
      editObjectives.value = doc.data()['objectives'];

      pre = document.createElement("pre");
      pre.classList.add("data-view");
      pre.classList.add("hide-in-edit");
      pre.innerHTML = doc.data()['assessment'];
      assessment.appendChild(pre);
      editAssessment.value = doc.data()['assessment'];

      pre = document.createElement("pre");
      pre.classList.add("data-view");
      pre.classList.add("hide-in-edit");
      pre.innerHTML = doc.data()['academic-integration'];
      academic.appendChild(pre);
      editAcademic.value = doc.data()['academic-integration'];

      pre = document.createElement("pre");
      pre.classList.add("data-view");
      pre.classList.add("hide-in-edit");
      pre.innerHTML = doc.data()['work-based-learning'];
      workBased.appendChild(pre);
      editWorkBased.value = doc.data()['work-based-learning'];

      pre = document.createElement("pre");
      pre.classList.add("data-view");
      pre.classList.add("hide-in-edit");
      pre.innerHTML = doc.data()['agenda'];
      agenda.appendChild(pre);
      editAgenda.value = doc.data()['agenda'];

      pre = document.createElement("pre");
      pre.classList.add("data-view");
      pre.classList.add("hide-in-edit");
      pre.innerHTML = doc.data()['notes'];
      notes.appendChild(pre);
      editNotes.value = doc.data()['notes'];

      techStandardsData = doc.data()['tech-standards'];
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
          console.log(techStandardsData);
        });
        container.appendChild(button);
        pre = document.createElement("pre");
        pre.classList.add("data-view");
        pre.innerHTML = techStandardsData[x];
        container.appendChild(pre);
        techStandards.appendChild(container);
      }

      profStandardsData = doc.data()['prof-standards'];
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
          console.log(profStandardsData);
        });
        container.appendChild(button);
        pre = document.createElement("pre");
        pre.classList.add("data-view");
        pre.innerHTML = profStandardsData[x];
        container.appendChild(pre);
        profStandards.appendChild(container);
      }

      vocabData = doc.data()['vocab'];
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
    })
      .catch((error) => {
        console.log("Error getting document: ", error);
      });
  }
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
  window.location.href = "view-lesson.html?course=cs1-2";
}

// Start Edit Mode
function editLesson() {
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
  hideEditElements();
  showViewElements();
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
  unitNum = editUnitNum.value;
  lessonNum = editLessonNum.value;
  //
  db.collection(course + "-curriculum").doc("unit-" + unitNum).set({
    "unit-num": editUnitNum.value,
    "unit-title": editUnitTitle.value
  }, { merge: true })
    .then(() => {
      // Write lesson to database
      db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum).set({
        "teacher-name": "Nathan Adams",
        "cte-program": "Software and App Design",
        "school": "Pueblo High School",
        "unit-num": editUnitNum.value,
        "unit-title": editUnitTitle.value,
        "lesson-num": editLessonNum.value,
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
        "vocab": vocabData
      }, { merge: true })
        .then(() => {
          // Notify user about success
          //alert("Unit " + unitNum + " lesson " + lessonNum + " saved");

          // Update db reference
          lessonRef = db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").doc("lesson-" + lessonNum);
          changed = false;

          // Update UI
          // Remove dynamically created data views
          clearDataAndElements();
          loadLesson();
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
        });

    })
    .catch((error) => {
      alert("Error saving Unit " + unitNum + " lesson " + lessonNum, error);
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
  editAcademic.classList.add("hidden");
  editProfStandardSelect.classList.add("hidden");
  editWorkBased.classList.add("hidden");
  editVocab.classList.add("hidden");
  editAgenda.classList.add("hidden");
  editNotes.classList.add("hidden");

  var elems = document.getElementsByClassName("small-button");
  for (var i = 0; i < elems.length; i++) {
    elems[i].classList.add("hidden");
  }
}

function hideViewElements() {
  unitTitle.classList.add("hidden");
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
  editUnitTitle.classList.remove("hidden");
  editUnitNum.classList.remove("hidden");
  editLessonNum.classList.remove("hidden");
  editLessonTitle.classList.remove("hidden");
  editDuration.classList.remove("hidden");
  editObjectives.classList.remove("hidden");
  editAssessment.classList.remove("hidden");
  editTechStandardSelect.classList.remove("hidden");
  editAcademic.classList.remove("hidden");
  editProfStandardSelect.classList.remove("hidden");
  editWorkBased.classList.remove("hidden");
  editVocab.classList.remove("hidden");
  editAgenda.classList.remove("hidden");
  editNotes.classList.remove("hidden");

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

  // Reset data fields
  unitNum = 0;
  lessonNum = 0;
  techStandardsData = [];
  profStandardsData = [];


}

// Add vocab word to the list
function addVocab() {
  const value = editVocab.value;
  if (value != undefined && value != "") {
    editVocab.value = "";
    vocabData.push(value);
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
  }
}

// Load tech standards from db
function loadTechStandards() {
  // If standards have been loaded already, return
  if (editTechStandardSelect.childElementCount > 2) return;

  db.collection("tech-standards")
    .get()
    .then((querySnapshot) => {
      var dropdown = document.getElementById("edit-tech-standard-select");
      querySnapshot.forEach((doc) => {
        var optgroup = document.createElement("optgroup");
        optgroup.label = doc.data()["title"];
        for (const p in doc.data()) {
          if (p != "title" && p != "number") {
            var option = document.createElement("option");
            option.value = doc.data()["number"] + "." + p + " " + doc.data()[p];
            option.text = option.value;
            optgroup.appendChild(option);
          }
        }
        dropdown.add(optgroup);
      });

    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  editTechStandardSelect.addEventListener("change", (event) => {
    //console.log(event.target.value);
    var text = event.target.value;
    techStandardsData.push(text);
    const container = document.createElement("div");
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
      console.log(techStandardsData);
    });
    container.appendChild(button);
    pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.innerHTML = text;
    container.appendChild(pre);
    techStandards.appendChild(container);
    editTechStandardSelect.value = 0;
  });
}

// Load prof standards from db
function loadProfStandards() {
  // If standards have been loaded already, return
  if (editProfStandardSelect.childElementCount > 2) return;

  // Load prof standards into select element from Firestore
  db.collection("prof-standards")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var optgroup = document.createElement("optgroup");
        optgroup.label = doc.data()["title"];
        for (const p in doc.data()) {
          if (p != "title" && p != "number") {
            var option = document.createElement("option");
            option.value = doc.data()["number"] + "." + p + " " + doc.data()[p];
            option.text = option.value;
            optgroup.appendChild(option);
          }
        }
        editProfStandardSelect.add(optgroup);
      });

    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  editProfStandardSelect.addEventListener("change", (event) => {
    //console.log(event.target.value);
    var text = event.target.value;
    profStandardsData.push(text);
    const container = document.createElement("div");
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
      console.log(profStandardsData);
    });
    container.appendChild(button);
    pre = document.createElement("pre");
    pre.classList.add("data-view");
    pre.innerHTML = text;
    container.appendChild(pre);
    profStandards.appendChild(container);
    editProfStandardSelect.value = 0;
  });
}