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
const main = document.getElementById("main");

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
    if (course == "cs1-2") showEditUi();
    
    console.log("User signed in");
    
  } else {
    // User is signed out
    // Update UI
    document.getElementById("user-email").classList.remove("hidden");
    document.getElementById("user-password").classList.remove("hidden");
    document.getElementById("sign-in-button").classList.remove("hidden");
    document.getElementById("sign-out-button").classList.add("hidden");
    document.getElementById("account-info").innerHTML = "";
    hideEditUi();
    
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
    showEditUi();
    // ...
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert("Error signing in: ", errorMessage);
  });
}

// Element references
const heading = document.getElementById("page-heading");

// Load course curriculum if specified
const urlParams = new URL(window.location.toLocaleString()).searchParams;
const course = urlParams.get('course');
if (course == "cs1-2") {
  document.getElementById("page-heading").innerHTML = "CS1-2 Curriculum";
  document.title = "CS1-2 Curriculum";
  loadCurriculum();
}
else {
  hideEditUi();
  showCourseSelect();
}

var unitCount = 0;
function loadCurriculum() {
  var dataRef = db.collection(course + "-curriculum");
  dataRef.orderBy('unit-num').get().then((querySnapshot) => {
    hideCourseSelect();
    unitCount = querySnapshot.size;
    querySnapshot.forEach((doc) => {
      // Get unit num for lesson
      const unitNum = doc.data()['unit-num'];
      // Create a section if it doesn't exist
      var sectionBtn = document.getElementById("unit" + unitNum);
      if (sectionBtn == undefined) {
        sectionBtn = document.createElement("button");
        sectionBtn.id = "unit" + unitNum;
        sectionBtn.classList.add("accordion");
        sectionBtn.innerHTML = "Unit " + unitNum + " " + doc.data()['unit-title'];
        // Event listener to show/hide panels on click
        sectionBtn.addEventListener("click", function () {
          /* Toggle between adding and removing the "active" class,
          to highlight the button that controls the panel */
          this.classList.toggle("active");

          /* Toggle between hiding and showing the active panel */
          var panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        });
        main.appendChild(sectionBtn);

        // Create hidden panel
        var section = document.createElement("section");
        section.classList.add("panel");
        // Add list to hold lesson links
        var list = document.createElement("ul");
        list.id = "unit" + unitNum + "-list";
        section.appendChild(list);
        // Add button to add lesson
        const addButton = document.createElement("a");
        addButton.innerHTML = "Add lesson"
        addButton.classList.add("add-lesson");
        const titleText = doc.data()['unit-title'];
        if (!user) addButton.classList.add("hidden");
        addButton.addEventListener("click", () => {
          addLesson(unitNum, 0, titleText);
        });
        // New lesson click listener updated after lessons loaded
        section.appendChild(addButton);

        main.appendChild(section);

        // Load lessons
        db.collection(course + "-curriculum").doc("unit-" + unitNum).collection("lessons").orderBy("lesson-num").get()
          .then((querySnapshot) => {
            addButton.addEventListener("click", () => {
              addLesson(unitNum, querySnapshot.size, titleText);
            });
            querySnapshot.forEach((doc) => {
              // Add lesson link to section list
              var a = document.createElement("a");
              a.appendChild(document.createTextNode(unitNum + "." + doc.data()['lesson-num'] + " " + doc.data()['lesson-title']));
              a.href = "view-lesson.html?course=" + course + "&unit=" + unitNum + "&lesson=" + doc.data()['lesson-num'];
              var li = document.createElement("li");
              li.appendChild(a);
              list.appendChild(li);
            });
          });
      }
    });
  })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

function hideCourseSelect() {
  document.getElementById("course-choices").style.display = "none";
}

function showCourseSelect() {
  document.getElementById("course-choices").style.display = "flex";
}

function hideEditUi(){
  var elems = document.getElementsByClassName("add-lesson");
  for (var i = 0; i < elems.length; i++){
    elems[i].classList.add("hidden");
  }
}

function showEditUi(){
  var elems = document.getElementsByClassName("add-lesson");
  for (var i = 0; i < elems.length; i++){
    elems[i].classList.remove("hidden");
  }
}

function addUnit(){
  window.location.href = "view-lesson.html?course=" + course + "&unit=" + unitCount + "&lesson=0";
}

function addLesson(unit, num, unitTitleText = "Untitled"){
  window.location.href = "view-lesson.html?course=" + course + "&unit=" + unit + "&lesson=" + num + "&unit-title=" + unitTitleText;
}