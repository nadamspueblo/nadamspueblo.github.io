var newsItems, newsIndex = 0;

function loadNews() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "news.html", false);
  xmlhttp.send();
  var element = document.createElement("div");
  element.innerHTML = xmlhttp.responseText;
  newsItems = element.getElementsByClassName("news-item");
}

function loadNewsItem(){
  var newsDiv = document.getElementById("news");
  newsDiv.innerHTML = "";
  newsDiv.innerHTML = newsItems[newsIndex].innerHTML;
  newsIndex++;
  newsIndex %= newsItems.length;
  setTimeout(loadNewsItem, 10000);
}

loadNews();
loadNewsItem();
window.scrollTo(0, 1);


function startTypingTitle() {
  var anim = new TypingAnimation(document.getElementById("site-title"), document.getElementById("site-title-text").innerHTML, 100);
  anim.start()
}

window.addEventListener("popstate", () => {
  if (document.visibilityState === 'visible') {
    animTextElement = document.getElementById("site-title");
    //animTextElement.innerHTML = "";
    //startTypingTitle();
    animTextElement.innerHTML = document.getElementById("site-title-text").innerHTML;
  }
});