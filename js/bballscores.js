document.addEventListener("DOMContentLoaded", function() {
    const nbaLogo = document.getElementById('nba-logo');
    const wnbaLogo = document.getElementById('wnba-logo');
    const ncaamwLogo = document.getElementById('ncaamw-logo');
    const ncaawLogo = document.getElementById('ncaaw-logo');

    const nbaScoresContainer = document.getElementById('nba-scores-container');
    const wnbaScoresContainer = document.getElementById('wnba-scores-container');
    const ncaamwScoresContainer = document.getElementById('ncaamw-scores-container');
    const ncaawScoresContainer = document.getElementById('ncaaw-scores-container');

    const apiUrlBase = 'https://site.api.espn.com/apis/site/v2/sports/basketball/';

    function fetchScores(league, containerId) {
        fetch(`${apiUrlBase}${league}/scoreboard`)
            .then(response => response.json())
            .then(data => {
                displayScores(data, containerId);
            })
            .catch(error => console.error('Error fetching scores:', error));
    }

    function displayScores(data, containerId) {
        const scoresContainer = document.getElementById(containerId);
        scoresContainer.innerHTML = ''; // Clear previous content

        data.events.forEach(event => {
            const gameContainer = document.createElement('div');
            gameContainer.classList.add('game-container');

            // Display team logos, names, and scores
            gameContainer.innerHTML = `
                <div class="team-score">
                    <img src="${event.competitions[0].competitors[0].team.logo}" alt="${event.competitions[0].competitors[0].team.displayName} Logo" class="team-logo">
                    <p>${event.competitions[0].competitors[0].team.displayName}</p>
                    <p>${event.competitions[0].competitors[0].score}</p>
                </div>
                <div class="team-score">
                    <img src="${event.competitions[0].competitors[1].team.logo}" alt="${event.competitions[0].competitors[1].team.displayName} Logo" class="team-logo">
                    <p>${event.competitions[0].competitors[1].team.displayName}</p>
                    <p>${event.competitions[0].competitors[1].score}</p>
                </div>
            `;

            scoresContainer.appendChild(gameContainer);
        });
    }

    nbaLogo.addEventListener('click', function() {
        nbaScoresContainer.style.display = 'block';
        wnbaScoresContainer.style.display = 'none';
        ncaamwScoresContainer.style.display = 'none';
        ncaawScoresContainer.style.display = 'none';
        fetchScores('nba', 'nba-scores');
    });

    wnbaLogo.addEventListener('click', function() {
        nbaScoresContainer.style.display = 'none';
        wnbaScoresContainer.style.display = 'block';
        ncaamwScoresContainer.style.display = 'none';
        ncaawScoresContainer.style.display = 'none';
        fetchScores('wnba', 'wnba-scores');
    });

    ncaamwLogo.addEventListener('click', function() {
        nbaScoresContainer.style.display = 'none';
        wnbaScoresContainer.style.display = 'none';
        ncaamwScoresContainer.style.display = 'block';
        ncaawScoresContainer.style.display = 'none';
        fetchScores('mens-college-basketball', 'ncaamw-scores');
    });

    ncaawLogo.addEventListener('click', function() {
        nbaScoresContainer.style.display = 'none';
        wnbaScoresContainer.style.display = 'none';
        ncaamwScoresContainer.style.display = 'none';
        ncaawScoresContainer.style.display = 'block';
        fetchScores('womens-college-basketball', 'ncaaw-scores');
    });
});
