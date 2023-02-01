var newsItems, newsIndex = 0;

function loadNews() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "news.html", false);
  xmlhttp.send();
  var element = document.createElement("div");
  element.innerHTML = xmlhttp.responseText;
  newsItems = element.getElementsByClassName("news-item");
}

function loadNewsItem() {
  var newsDiv = document.getElementById("news");
  newsDiv.innerHTML = "";
  newsDiv.innerHTML = newsItems[newsIndex].innerHTML;
  newsDiv.scrollTop = 0;
  newsIndex++;
  newsIndex %= newsItems.length;
  setTimeout(loadNewsItem, 10000);
}

loadNews();
loadNewsItem();
if (location.hash == "") {
  location.hash = "#top";
}

function startTypingTitle() {
  if (location.hash == "#top"){
    setTimeout(function() {
      window.scrollTop = 0;
      window.scrollTo(0, 1);
    }, 1);
  }
  var title = document.getElementById("site-title");
  if (title.innerHTML == ""){
    var anim = new TypingAnimation(title, document.getElementById("site-title-text").innerHTML, 100, true);
    anim.start();
  }
}

window.addEventListener("popstate", () => {
  if (document.visibilityState === 'visible') {
    animTextElement = document.getElementById("site-title");
    //animTextElement.innerHTML = "";
    //startTypingTitle();
    //if (animTextElement.innerHTML == "")
    //  animTextElement.innerHTML = document.getElementById("site-title-text").innerHTML;
  }
});