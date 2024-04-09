const API_KEY = "cd4af9ca0fa54e31a45dee8fa25c11a5";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    fetchNews("India").catch(error => {
        console.error("Error fetching news:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to fetch news. Please try again later.";
        document.getElementById("cards-container").appendChild(errorMessage);
    });
    startClock();
});

function startProject() {
    window.location.href = "main.html";
}

function reload() {
    window.location.href = "index.html";
}

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const timeString = `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    document.getElementById('clock').innerHTML = timeString;
}

function startClock() {
    setInterval(updateClock, 1000);
}

async function fetchNews(query) {
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch news: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to fetch news. Please try again later.";
        const githubLink = document.createElement("a");
        githubLink.textContent = "View Source Code on GitHub & Run it locally";
        githubLink.href = "https://github.com/kautilyakameshmishra/Insight-EDGE";
        githubLink.target = "_blank";
        errorMessage.appendChild(document.createElement("br"));
        errorMessage.appendChild(githubLink);
        document.getElementById("cards-container").appendChild(errorMessage);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;

function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query).catch(error => {
        console.error("Error fetching news:", error);
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Failed to fetch news. Please try again later.";
        document.getElementById("cards-container").appendChild(errorMessage);
    });
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

