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
const jsControl = ["if ", "else ", "for ", "while ", "do "];
const jsOperators = [" < ", " > ", " <= ", " >= ", "!", "++", "-", " + ", "--", " / ", " % ", " * ", ";", ",", ".", "**", "%", "&#61;", "||", "&&"];
const isNumeric = n => /\d|\./.test(n);
//console.log(lintJS("a && b"));

let codeElements = document.getElementsByClassName("jscode");
for (let e of codeElements) {
  e.innerHTML = lintJS(e.innerHTML);
}

codeElements = document.getElementsByClassName("htmlcode");
for (let e of codeElements) {
  e.innerHTML = lintHTML(e.innerHTML);
}

codeElements = document.getElementsByClassName("csscode");
for (let e of codeElements) {
  e.innerHTML = lintCSS(e.innerHTML);
}

// HTML lint functions

function lintHTML(code) {
  code = code.replaceAll("=", "&#61;");
  code = lintHTMLTags(code);
  code = lintHTMLAttrib(code);
  code = code.replaceAll("&lt;/", "<span class='htmlbracket'>&lt;/</span>");
  code = code.replaceAll("&lt;", "<span class='htmlbracket'>&lt;</span>");
  code = code.replaceAll("&gt;", "<span class='htmlbracket'>&gt;</span>");
  return code;
}

function lintHTMLAttrib(code) {
  let result = "";
  let startIndex = code.search(/\w+&#61;"/);
  if (startIndex > 0) result += code.substring(0, startIndex);
  let endIndex = code.indexOf("&#61;", startIndex);
  while (startIndex >= 0 && endIndex > startIndex) {
    // keyword
    result += "<span class='htmlattrib'>" + code.substring(startIndex, endIndex) + "</span>";
    // equal sign
    result += "<span class='jsoperator'>&#61;</span>";
    // value
    startIndex = endIndex + 6;
    endIndex = code.indexOf("\"", startIndex);
    result += "<span class='jsstring'>" + code.substring(startIndex - 1, endIndex + 1) + "</span>";

    code = code.substring(endIndex + 1);
    startIndex = code.search(/\w+&#61;"/);
    if (startIndex >= 0) {
      result += code.substring(0, startIndex);
      endIndex = code.indexOf("&#61;", startIndex);
    }
  }

  result += code;
  return result;
}

function lintHTMLTags(code) {
  let result = "";
  let startIndex = code.search(/&lt;/);
  // Increment to not include the symbol
  startIndex += 4;
  if (startIndex > 0) result += code.substring(0, startIndex);
  let endIndex = code.indexOf("&gt;", startIndex);
  while (startIndex >= 0 && endIndex > startIndex) {
    if (code.charAt(startIndex + 1) == "/") startIndex++;
    result += "<span class='htmltag'>" + code.substring(startIndex, endIndex) + "</span>";

    code = code.substring(endIndex);
    startIndex = code.search(/&lt;/);
    if (startIndex >= 0) {
      result += code.substring(0, startIndex);
      endIndex = code.indexOf("&gt;", startIndex);
    }
  }

  result += code;
  return result;
}

function lintHTMLStrings(code) {
  let result = "";
  let startIndex = code.indexOf("\"");
  let endIndex = 0;
  while (startIndex >= 0 && endIndex < code.length) {
    result += code.substring(endIndex, startIndex);
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
  result += code.substring(startIndex);
  return result;
}

// CSS lint functions

function lintCSS(code) {
  code = lintCSSSelectors(code);
  code = lintCSSProperties(code);
  //code = lintCSSNumbers(code);
  code = code.replaceAll(";", "<span class='cssoperator'>;</span>");
  code = code.replaceAll("{", "<span class='jsbracket'>{</span>");
  code = code.replaceAll("}", "<span class='jsbracket'>}</span>");
  return code;
}

function lintCSSSelectors(code) {
  let result = "";
  let startIndex = 0;
  let endIndex = code.search(/{/);
  while (startIndex >= 0 && endIndex > startIndex) {
    result += "<span class='cssselector'>" + code.substring(startIndex, endIndex) + "</span>";
    startIndex = endIndex;
    endIndex = code.indexOf("}", startIndex) + 1;
    endIndex = endIndex == -1 ? code.length : endIndex;

    result += code.substring(startIndex, endIndex);
    code = code.substring(endIndex);

    startIndex = 0;
    endIndex = code.search(/{/);
  }
  return result;
}

function lintCSSProperties(code) {
  let result = "";
  let startIndex = code.search(/(\w+\-\w+:\s)|(\w+:\s)/);
  if (startIndex > 0) result += code.substring(0, startIndex);
  let endIndex = code.indexOf(":", startIndex);
  while (startIndex >= 0 && endIndex > startIndex) {
    // keyword
    result += "<span class='htmlattrib'>" + code.substring(startIndex, endIndex) + "</span>";
    // : symbol
    result += "<span class='cssoperator'>:</span>";

    code = code.substring(endIndex + 1);
    startIndex = code.search(/(\w+\-\w+:\s)|(\w+:\s)/);
    if (startIndex >= 0) {
      result += code.substring(0, startIndex);
      endIndex = code.indexOf(":", startIndex);
    }
  }

  result += code;
  return result;
}

function lintCSSNumbers(code) {
  let result = "";
  let startIndex = code.search(/[0-9]\w/);
  let endIndex = code.indexOf(";", startIndex);
  if (endIndex == -1) endIndex = code.indexOf(" ", startIndex);
  while (startIndex >= 0 && endIndex > startIndex) {
    result += "<span class='jsnumber'>" + code.substring(startIndex, endIndex) + "</span>";
    startIndex = endIndex;
    endIndex = code.indexOf(";", startIndex);
    if (endIndex == -1) endIndex = code.indexOf(" ", startIndex);
    endIndex++;
  }

  return result;
}

// JS lint functions

function lintJS(code) {
  // Remove html escape chars
  code = code.replaceAll("&lt;", "<");
  code = code.replaceAll("&gt;", ">");
  code = code.replaceAll("&amp;", "&");

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
  if (code.charAt(startIndex - 1) == ":") {
    return lintStrings(code);
  }
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
    if (endIndex >= startIndex) {
      result += "<span class='jsnumber'>";
      result += code.substring(startIndex, endIndex) + "</span>";
      startIndex += code.substring(endIndex).search(/\d/);
      if (code.charAt(startIndex) == " ") {
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

function lintFunctions(code) {
  let result = "";
  let startIndex = code.search(/\w+\(/);
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