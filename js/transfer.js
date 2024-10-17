document.addEventListener("DOMContentLoaded", function () {
    const newsContainer = document.getElementById("news-container");
    const apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news';

    // Fetch Transfer News
    function fetchTransferNews() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const articles = data.articles;

                // Clear previous news content
                newsContainer.innerHTML = "";

                // Loop through the articles and display them
                articles.forEach(article => {
                    const newsItem = document.createElement("div");
                    newsItem.classList.add("news-item");

                    // Check if image or video URLs exist
                    const imageUrl = article.images && article.images.length > 0 ? article.images[0].url : '';
                    const videoUrl = article.video ? article.video.url : '';

                    newsItem.innerHTML = `
                    <div class="news-banner">NEWS</div>
                    ${imageUrl ? `<img src="${imageUrl}" alt="${article.headline}" class="news-image">` : ''}
                    ${videoUrl ? `<video controls class="news-video"><source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.</video>` : ''}
                    <h3>${article.headline}</h3>
                    <p>${article.description}</p>
                    <a href="${article.links.web.href}" target="_blank" class="read-more-button">Read More</a>
                `;

                    newsContainer.appendChild(newsItem);
                });
            })
            .catch(error => {
                console.error('Error fetching transfer news:', error);
            });
    }

    // Load transfer news when page is ready
    fetchTransferNews();
});
