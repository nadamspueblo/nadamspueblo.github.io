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




console.log("Script loaded");