if (window.matchMedia("(min-width: 768px)").matches) {
  var element = document.getElementById("overview");
  element.classList.toggle("active");
  var panel = element.nextElementSibling;
  panel.style.display = "block";
}
