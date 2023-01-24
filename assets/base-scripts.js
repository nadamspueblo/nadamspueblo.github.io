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
var animTextElement, text, prevAnimTime = 0, animProgress = 0, typingSpeed = 25, animDelay = 0;
// min-width: 768px
var eventType = "click";
if (window.matchMedia("(min-width: 768px)").matches) {
  eventType = "mouseover";
}

for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener(eventType, function (e) {
    var dataElement = this.getElementsByClassName("data")[0];
    if (dataElement && dataElement.className == "data" && prevAnimTime == 0) {
      animTextElement = this.getElementsByClassName("anim-type-text")[0];
      text = dataElement.innerHTML;
      typingSpeed = 25;
      animDelay = 400;
      requestAnimationFrame(typingAnimation);
      if (eventType == "click" && text.length > 0) {
        e.preventDefault();
      }
    }
  });

  if (eventType == "mouseover") {
    navLinks[i].addEventListener("mouseout", function () {
      text = "";
      animTextElement.innerHTML = "";
      prevAnimTime = 0;
    });
  }
}

function typingAnimation(timestamp) {
  if (prevAnimTime == 0) {
    prevAnimTime = timestamp;
  }
  animProgress = timestamp - prevAnimTime;

  if (animProgress <= animDelay) {
    requestAnimationFrame(typingAnimation);
  }
  else if (text.length > 0) {
    animDelay = 0;
    if (animProgress > typingSpeed) {
      animTextElement.innerHTML += text.substring(0, 1);
      text = text.substring(1, text.length);
      prevAnimTime = timestamp;
    }
    requestAnimationFrame(typingAnimation);
  }
  else {
    prevAnimTime = 0;
    animDelay = 0;
  }

}

function startTypingTitle() {
  text = document.getElementById("site-title-text").innerHTML;
  animTextElement = document.getElementById("site-title");
  typingSpeed = 100;
  prevAnimTime = 0;
  requestAnimationFrame(typingAnimation);
}

window.addEventListener("popstate", () => {
  if (document.visibilityState === 'visible') {
    animTextElement = document.getElementById("site-title");
    animTextElement.innerHTML = "";
    startTypingTitle();
  }
});

console.log("Script loaded");