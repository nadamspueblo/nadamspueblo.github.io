const root = document.getElementsByTagName("body").item(0);
let isRunning = false;

// Initialize main element
root.style.position = "absolute";
root.style.margin = "0px";
root.style.width = "100vw";
root.style.height = "100vh";
root.style.left = "50%";
root.style.transform = "translateX(-50%)";
root.style.backgroundColor = "lightgray";

// Add controls
let nav = document.createElement("nav");
nav.style.textAlign = "center";
nav.id = "controls";
let startButton = document.createElement("button");
startButton.innerHTML = "Start";
startButton.addEventListener("click", start);
nav.append(startButton);
let stopButton = document.createElement("button");
stopButton.innerHTML = "Stop"
stopButton.addEventListener("click", stop);
nav.append(stopButton);
root.append(nav);

function hideControls() {
  let nav = document.getElementById("controls");
  nav.style.visibility = "hidden";
}

function showControls() {
  let nav = document.getElementById("controls");
  nav.style.visibility = "visible";
}


/* ************* Element Creation ********************* */
function createElement(id, type = "div", x = 0, y = 0) {
  let e = document.createElement(type);
  e.style.position = "absolute";
  e.style.width = "fit-content";
  e.style.left = x + "px";
  e.style.top = y + "px";
  e.id = id;
  root.append(e);
}

function createImg(id, filename, x = 0, y = 0) {
  let e = document.createElement("img");
  e.src = filename;
  e.style.position = "absolute";
  e.style.width = "fit-content";
  e.style.left = x + "px";
  e.style.top = y + "px";
  e.id = id;
  root.append(e);
}

function createRect(x, y, w, h, color = "white", id = "") {
  let e = document.createElement("div");
  e.style.position = "absolute";
  e.style.width = w + "px";
  e.style.height = h + "px";
  e.style.left = x + "px";
  e.style.top = y + "px";
  e.style.backgroundColor = color;
  e.id = id;
  root.append(e);
}

function createCircle(x, y, r, color = "white", id = "") {
  let e = document.createElement("div");
  e.style.position = "absolute";
  e.style.width = 2 * r + "px";
  e.style.height = 2 * r + "px";
  e.style.borderRadius = "50%";
  e.style.left = x + "px";
  e.style.top = y + "px";
  e.style.backgroundColor = color;
  e.id = id;
  root.append(e);
}

/* ************* Style Helpers ***************** */
function setWindowWidth(value) {
  root.style.width = value + "px";
}

function getWindowWidth() {
  return root.offsetWidth;
}

function setWindowHeight(value) {
  root.style.height = value + "px";
}

function getWindowHeight() {
  return root.offsetHeight;
}

function setWidth(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.width = value + "px";
  else console.error(id + " does not exist");
}

function getWidth(id) {
  let e = document.getElementById(id);
  if (e) return e.offsetWidth;
  else console.error(id + " does not exist");
}

function setHeight(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.height = value + "px";
  else console.error(id + " does not exist");
}

function getHeight(id) {
  let e = document.getElementById(id);
  if (e) return e.offsetHeight;
  else console.error(id + " does not exist");
}

function setX(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.left = value + "px";
  else console.error(id + " does not exist");
}

function getX(id) {
  let e = document.getElementById(id);
  if (e) return e.offsetLeft;
  else console.error(id + " does not exist");
}

function setY(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.top = value + "px";
  else console.error(id + " does not exist");
}

function getY(id) {
  let e = document.getElementById(id);
  if (e) return e.offsetTop;
  else console.error(id + " does not exist");
}

function changeXBy(id, value) {
  let e = document.getElementById(id);
  if (e) {
    e.style.left = e.offsetLeft + Number(value) + "px";
  }
  else console.error(id + " does not exist");
}

function changeYBy(id, value) {
  let e = document.getElementById(id);
  if (e) {
    ;
    e.style.top = e.offsetTop + Number(value) + "px";
  }
  else console.error(id + " does not exist");
}

function move(id, value = 10) {
  let e = document.getElementById(id);
  if (e) {
    let deg = e.style.rotate.substring(0, e.style.rotate.indexOf("deg"));
    deg = Number(deg);
    let rad = deg * Math.PI / 180;
    e.style.left = (e.offsetLeft + Number(value) * Math.cos(rad)) + "px";
    e.style.top = (e.offsetTop + Number(value) * Math.sin(rad)) + "px";
  }
  else console.error(id + " does not exist");
}

function setRotation(id, degrees) {
  let e = document.getElementById(id);
  if (e) e.style.rotate = degrees + "deg";
  else console.error(id + " does not exist");
}

function getRotation(id) {
  let e = document.getElementById(id);
  if (e) {
    return stripUnits(e.style.rotate, "deg");
  }
  else console.error(id + " does not exist");
}

function rotate(id, degrees) {
  let e = document.getElementById(id);
  if (e) {
    e.style.rotate = stripUnits(e.style.rotate, "deg") + Number(degrees) + "deg";
  }
  else console.error(id + " does not exist");
}

function setText(id, value) {
  let e = document.getElementById(id);
  if (e) e.innerHTML = value;
  else console.error(id + " does not exist");
}

function getText(id) {
  let e = document.getElementById(id);
  if (e) return e.innerHTML;
  else console.error(id + " does not exist");
}

function setWindowColor(color) {
  root.style.backgroundColor = color;
}

function getWindowColor() {
  return root.style.backgroundColor;
}

function setColor(id, color) {
  let e = document.getElementById(id);
  if (e) e.style.backgroundColor = color;
  else console.error(id + " does not exist");
}

function getColor(id) {
  let e = document.getElementById(id);
  if (e) return e.style.backgroundColor;
  else console.error(id + " does not exist");
}

function setTextColor(id, color) {
  let e = document.getElementById(id);
  if (e) e.style.color = color;
  else console.error(id + " does not exist");
}

function getTextColor(id) {
  let e = document.getElementById(id);
  if (e) return e.style.color;
  else console.error(id + " does not exist");
}

function setProperty(id, property, value) {
  let e = document.getElementById(id);
  if (e) {
    e.style[getCamelCaseProp(property)] = value;
  }
  else console.error(id + " does not exist");
}

function getProperty(id, property) {
  let e = document.getElementById(id);
  if (e) {
    return e.style[getCamelCaseProp(property)] = value;
  }
  else console.error(id + " does not exist");
}


/* ************ Event Helpers ****************** */

function addOnClickEvent(id, f) {
  let e = document.getElementById(id);
  if (e) e.addEventListener("click", f);
  else console.error(id + " does not exist");
}

function addKeyDownEvent(f) {
  addEventListener("keydown", f);
}

function isTouching(id1, id2) {
  let e1 = document.getElementById(id1);
  let e2 = document.getElementById(id2);
  if (!e1) {
    console.error(id1 + " does not exist");
    return false;
  }
  if (!e2) {
    console.error(id2 + " does not exist");
    return false;
  }



}

/* *************** Animation ******************* */
function start() {
  isRunning = true;
  window.requestAnimationFrame(step);
}

function stop() {
  isRunning = false;
}

function step(time) {
  if (typeof (mainLoop) != 'undefined') mainLoop(time);
  else {
    isRunning = false;
    console.error("You must define a mainLoop() function");
  }
  if (isRunning) window.requestAnimationFrame(step)
}

/* *************** Utility ********************* */

function stripUnits(value, unit) {
  return Number(value.substring(0, value.indexOf(unit)));
}

function getCamelCaseProp(property) {
  let actualProp = property.toLowerCase();
  if (property.indexOf("-") > -1) {
    let temp = actualProp.split("-");
    actualProp = temp[0];
    for (let i = 1; i < temp.length; i++) {
      actualProp += temp[i].substring(0, 1).toUpperCase() + temp[i].substring(1);
    }
  }
  return actualProp;
}