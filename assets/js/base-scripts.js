/**Accordian button functionality */
var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
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
}

/**Animated typed text on hover or click */
var navLinks = document.getElementsByClassName("nav-link");
var animTextElement, text;
// min-width: 768px
var eventType = "click";
if (window.matchMedia("(min-width: 768px)").matches) {
  eventType = "mouseover";
}

for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener(eventType, function (e) {
    var dataElement = this.getElementsByClassName("data")[0];
    if (eventType == "mouseover" && dataElement && dataElement.className == "data") {
      animTextElement = this.getElementsByClassName("anim-type-text")[0];
      text = dataElement.innerHTML;
      this.anim = new TypingAnimation(animTextElement, text, 25, 400);
      this.anim.start();
    }
  });

  if (eventType == "mouseover") {
    navLinks[i].addEventListener("mouseout", function () {
      this.anim.stop();
      animTextElement.innerHTML = "";
    });
  }
}


/** Preview-expand panel functionality */
const expandTabs = document.getElementsByClassName("preview-expand-tab");
const expandPanels = document.getElementsByClassName("preview-expand");

for (let i = 0; i < expandTabs.length; i++) {
  expandPanels[i].style.maxHeight = "200px";
  expandTabs[i].addEventListener("click", function () {
    /* Toggle between hiding and showing the active panel */
    var tab = expandTabs[i];
    var panel = expandPanels[i];
    if (panel.style.maxHeight === "200px") {
      tab.innerHTML = "Less [-]";
      panel.style.maxHeight = "fit-content";

    } else {
      tab.innerHTML = "More [+]";
      panel.style.maxHeight = "200px";
    }
  });
}

/** Linting of code elements */
const jsKeyWords = ["var", "let", "const", "function", "true", "false", "return"];
const jsBrackets = ["[", "]", "{", "}", "(", ")"];
const jsControl = ["if ", "for ", "while "];
const jsOperators = [" < ", " > ", " <= ", " >= ", "++", "-", " + ", "--", " / ", " % ", " * ", ";", ",", "."];
const codeElements = document.getElementsByClassName("jscode");
//const isNumeric = n => !isNaN(n);
const isNumeric = n => /\d|\./.test(n);

for (let e of codeElements) {
  e.innerHTML = lint(e.innerHTML);
}

function lint(code) {
  // Remove html escape chars
  code = code.replaceAll("&lt;", "<");
  code = code.replaceAll("&gt;", ">");

  // Start lint process with block comments
  code = lintComments(code);

  // Replace html escape chars
  code = code.replaceAll(" < ", " &lt; ");
  code = code.replaceAll(" > ", " &gt; ");
  code = code.replaceAll(" <= ", " &lt;= ");
  code = code.replaceAll(" >= ", " &gt;= ");
  return code;
}

function lintComments(code) {
  let result = "";
  let startIndex = code.indexOf("/*");
  let endIndex = 0;
  while (startIndex >= 0 && endIndex < code.length) {
    result += lintInlineComments(code.substring(endIndex, startIndex));
    result += "<span class='jscomment'>";
    endIndex = code.indexOf("*/", startIndex) + 3;
    result += code.substring(startIndex, endIndex) + "</span>";
    startIndex = code.indexOf("/*", endIndex);
  }
  if (code.lastIndexOf("*/") >= 0) {
    startIndex = code.lastIndexOf("*/") + 2;
  }
  else {
    startIndex = 0;
  }
  result += lintInlineComments(code.substring(startIndex));
  return result;
}

function lintInlineComments(code) {
  let result = "";
  let startIndex = code.indexOf("//");
  let endIndex = 0;
  while (startIndex >= 0 && endIndex < code.length) {
    result += lintStrings(code.substring(endIndex, startIndex));
    result += "<span class='jscomment'>";
    endIndex = code.indexOf("\n", startIndex) + 1;
    result += code.substring(startIndex, endIndex) + "</span>";
    startIndex = code.indexOf("//", endIndex);
  }
  if (code.lastIndexOf("//") >= 0) {
    startIndex = code.lastIndexOf("//") + 2;
    startIndex = code.indexOf("\n", startIndex);
  }
  else {
    startIndex = 0;
  }
  result += lintStrings(code.substring(startIndex));
  return result;
}

function lintStrings(code) {
  let result = "";
  let startIndex = code.indexOf("\"");
  let endIndex = 0;
  while (startIndex >= 0 && endIndex < code.length) {
    result += lintNumbers(code.substring(endIndex, startIndex));
    result += "<span class='jsstring'>";
    endIndex = code.indexOf("\"", startIndex + 1) + 1;
    result += code.substring(startIndex, endIndex) + "</span>";
    startIndex = code.indexOf("\"", endIndex);
  }
  if (code.lastIndexOf("\"") >= 0) {
    startIndex = code.lastIndexOf("\"") + 1;
  }
  else {
    startIndex = 0;
  }
  result += lintNumbers(code.substring(startIndex));
  return result;
}

function lintNumbers(code) {
  let result = "";
  let startIndex = code.search(/\d/);
  let endIndex = 0;
  while (startIndex >= 0 && startIndex >= endIndex && endIndex < code.length) {
    result += lintFunctions(code.substring(endIndex, startIndex));
    endIndex = startIndex;
    while (endIndex < code.length && isNumeric(code.charAt(endIndex))) {
      endIndex++;
    }
    if (endIndex >= startIndex){
      result += "<span class='jsnumber'>";
      result += code.substring(startIndex, endIndex) + "</span>";
      startIndex += code.substring(endIndex).search(/\d/);
      if (code.charAt(startIndex) == " "){
        startIndex++;
      }
    }
    else {
      break;
    }
  }
  result += lintFunctions(code.substring(endIndex));
  return result;
}

function lintKeywords(code) {
  // Operators
  // = must come first because of = in html attribs
  code = code.replaceAll("=", "<span class='jsoperator'>=</span>");
  for (let k of jsOperators) {
    code = code.replaceAll(k, "<span class='jsoperator'>" + k + "</span>");
  }
  // Keywords
  for (let k of jsKeyWords) {
    code = code.replaceAll(k, "<span class='jskeyword'>" + k + "</span>");
  }
  // Brackets and parentheses
  for (let k of jsBrackets) {
    code = code.replaceAll(k, "<span class='jsbracket'>" + k + "</span>");
  }
  // Control keywords
  for (let k of jsControl) {
    code = code.replaceAll(k, "<span class='jscontrol'>" + k + "</span>");
  }
  return code;
}
console.log("function myFunc(param) {");
console.log(lintFunctions("function myFunc(param) { } function myOther() { var"))
function lintFunctions(code){
  let result = "";
  let startIndex = code.search(/\w+\(/);
  console.log(startIndex);
  let endIndex = code.indexOf("(", startIndex);
  //if (endIndex > 0) endIndex++;
  while (startIndex >= 0 && endIndex > startIndex) {
    if (startIndex > 0)
      result += lintKeywords(code.substring(0, startIndex));
    result += "<span class='jsfunction'>";
    result += code.substring(startIndex, endIndex) + "</span>";

    code = code.substring(endIndex);
    startIndex = code.search(/\w+\(/);
    endIndex = code.indexOf("(", startIndex);
    //if (endIndex > 0) endIndex++;
  }
  result += lintKeywords(code);
  return result;
}

console.log("Script loaded");