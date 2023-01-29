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