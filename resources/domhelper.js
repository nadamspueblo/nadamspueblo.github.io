const stage = document.getElementsByTagName("main").item(0);
let isRunning = false;

// Initialize main element
stage.style.position = "absolute";
stage.style.width = "640px";
stage.style.height = "480px";
stage.style.left = "50%";
stage.style.transform = "translateX(-50%)";
stage.style.backgroundColor = "lightgray";
for (e of stage.children) {
  e.style.position = "absolute";
}

function createElement(id, type = "div", x = 0, y = 0) {
  let e = document.createElement(type);
  e.style.position = "absolute";
  e.style.width = "fit-content";
  e.style.left = x + "px";
  e.style.top = y + "px";
  e.id = id;
  stage.append(e);
}

/* ************* Style Helpers ***************** */
function setStageWidth(value) {
  stage.style.width = value + "px";
}

function setStageHeight(value) {
  stage.style.height = value + "px";
}

function setWidth(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.width = value + "px";
  else console.error(id + " does not exist");
}

function setHeight(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.height = value + "px";
  else console.error(id + " does not exist");
}

function setX(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.left = value + "px";
  else console.error(id + " does not exist");
}

function setY(id, value) {
  let e = document.getElementById(id);
  if (e) e.style.top = value + "px";
  else console.error(id + " does not exist");
}

function changeXBy(id, value) {
  let e = document.getElementById(id);
  if (e) {
    let current = e.style.left;
    current = current.substring(0, current.indexOf("px"));
    current = Number(current);
    e.style.left = current + Number(value) + "px";
  }
  else console.error(id + " does not exist");
}

function changeYBy(id, value) {
  let e = document.getElementById(id);
  if (e) {
    let current = e.style.top;
    current = current.substring(0, current.indexOf("px"));
    current = Number(current);
    e.style.top = current + Number(value) + "px";
  }
  else console.error(id + " does not exist");
}

function rotate(id, degrees) {
  let e = document.getElementById(id);
  if (e) e.style.transform = "rotate(" + degrees + "deg)";
  else console.error(id + " does not exist");
}

function setText(id, value) {
  let e = document.getElementById(id);
  if (e) e.innerHTML = value;
  else console.error(id + " does not exist");
}

function setStageColor(color) {
  stage.style.backgroundColor = color;
}

function setColor(id, color) {
  let e = document.getElementById(id);
  if (e) e.style.backgroundColor = color;
  else console.error(id + " does not exist");
}

function setTextColor(id, color) {
  let e = document.getElementById(id);
  if(e) e.style.color = color;
  else console.error(id + " does not exist");
}

function setProperty(id, property, value) {
  let e = document.getElementById(id);
  if(e) {
    let actualProp = property;
    // Switch to camelCase if property written CSS style with hyphens
    if (property.indexOf("-") > -1) {
      actualProp = actualProp.toLowerCase();
      let temp = actualProp.split("-");
      actualProp = temp[0];
      for (let i = 1; i < temp.length; i++){
        actualProp += temp[i].substring(0, 1).toUpperCase() + temp[i].substring(1);
      }
    }
    e.style[actualProp] = value;
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
  if (typeof(init) != 'undefined') init();
  window.requestAnimationFrame(step);
}

function stop() {
  isRunning = false;
}

function step(time) {
  if (typeof(mainLoop) != 'undefined') mainLoop(time);
  else {
    isRunning = false;
    console.error("You must define a mainLoop() function");
  }
  if (isRunning) window.requestAnimationFrame(step)
}

/* *************** Utility ********************* */

function stripPx(value) {
  return current.substring(0, current.indexOf("px"));
}