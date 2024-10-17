document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const logos = document.querySelectorAll('.news-header a');

    // Event listener for all logos
    logos.forEach(logo => {
        logo.addEventListener('click', (e) => {
            e.preventDefault();
            const league = logo.getAttribute('data-league');
            fetchNews(league);

            // Remove 'active-logo' class from all logos and add it to the clicked one
            logos.forEach(l => l.classList.remove('active-logo'));
            logo.classList.add('active-logo');
        });
    });

    // Fetch news based on the selected league
    function fetchNews(league) {
        let apiUrl;
        switch (league) {
            case 'nba':
                apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news';
                break;
            case 'wnba':
                apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/news';
                break;
            case 'ncaa':
                apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news';
                break;
            default:
                apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news';
        }

        // Fetch the news data from the specific API
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displayNews(data.articles))
            .catch(error => console.error('Error fetching news:', error));
    }

    // Function to display the news in the container
    function displayNews(newsArticles) {
        newsContainer.innerHTML = ''; // Clear previous news

        newsArticles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            // Add the article title, image, and description
            newsItem.innerHTML = `
                <h3>${article.headline}</h3>
                <img src="${article.images[0].url}" alt="${article.headline}">
                <p>${article.description}</p>
                <a href="${article.links.web.href}" target="_blank" class="read-more-button">Read More</a>
            `;
            newsContainer.appendChild(newsItem);
        });
    }

    // Initial fetch for NBA news on page load
    fetchNews('nba');
});
