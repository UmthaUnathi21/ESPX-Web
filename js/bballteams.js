document.addEventListener("DOMContentLoaded", function () {
    const nbaContainer = document.getElementById("nba-container");
    const wnbaContainer = document.getElementById("wnba-container");
    const ncaamwContainer = document.getElementById("ncaamw-container");
    const ncaawContainer = document.getElementById("ncaaw-container");

    const nbaSearch = document.getElementById("nba-search");
    const wnbaSearch = document.getElementById("wnba-search");
    const ncaamwSearch = document.getElementById("ncaamw-search");
    const ncaawSearch = document.getElementById("ncaaw-search");

    const nbaTeamsContainer = document.getElementById("nba-teams");
    const wnbaTeamsContainer = document.getElementById("wnba-teams");
    const ncaamwTeamsContainer = document.getElementById("ncaamw-teams");
    const ncaawTeamsContainer = document.getElementById("ncaaw-teams");

    // League logos
    const nbaLogo = document.getElementById("nba-logo");
    const wnbaLogo = document.getElementById("wnba-logo");
    const ncaamwLogo = document.getElementById("ncaamw-logo");
    const ncaawLogo = document.getElementById("ncaaw-logo");

    let nbaTeams = [], wnbaTeams = [], ncaamwTeams = [], ncaawTeams = [];

    // Fetch NBA Teams
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams')
        .then(response => response.json())
        .then(data => {
            nbaTeams = data.sports[0].leagues[0].teams;
            displayTeams(nbaTeams, nbaTeamsContainer);
        });

    // Fetch WNBA Teams
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/teams')
        .then(response => response.json())
        .then(data => {
            wnbaTeams = data.sports[0].leagues[0].teams;
            displayTeams(wnbaTeams, wnbaTeamsContainer);
        });

    // Fetch NCAA Men's Teams
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams')
        .then(response => response.json())
        .then(data => {
            ncaamwTeams = data.sports[0].leagues[0].teams;
            displayTeams(ncaamwTeams, ncaamwTeamsContainer);
        });

    // Fetch NCAA Women's Teams
    fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/teams')
        .then(response => response.json())
        .then(data => {
            ncaawTeams = data.sports[0].leagues[0].teams;
            displayTeams(ncaawTeams, ncaawTeamsContainer);
        });

    // Display teams function
    function displayTeams(teams, container) {
        container.innerHTML = "";
        teams.forEach(item => {
            const team = item.team;
            const teamItem = document.createElement("div");
            teamItem.classList.add("team-item");

            teamItem.innerHTML = `
                <img src="${team.logos[0].href}" alt="${team.displayName} logo" class="team-logo">
                <h3>${team.displayName}</h3>
                <p>Abbreviation: ${team.abbreviation || 'N/A'}</p>
                <p>Venue: <a href="${team.links[0].href}" target="_blank">Visit Clubhouse</a></p>
            `;

            container.appendChild(teamItem);
        });
    }

    // Search functionality for each league
    nbaSearch.addEventListener("input", () => filterTeams(nbaTeams, nbaTeamsContainer, nbaSearch.value));
    wnbaSearch.addEventListener("input", () => filterTeams(wnbaTeams, wnbaTeamsContainer, wnbaSearch.value));
    ncaamwSearch.addEventListener("input", () => filterTeams(ncaamwTeams, ncaamwTeamsContainer, ncaamwSearch.value));
    ncaawSearch.addEventListener("input", () => filterTeams(ncaawTeams, ncaawTeamsContainer, ncaawSearch.value));

    // Filter teams based on search input
    function filterTeams(teams, container, searchTerm) {
        const filteredTeams = teams.filter(item => 
            item.team.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayTeams(filteredTeams, container);
    }

    // Show respective league container on logo click
    nbaLogo.addEventListener("click", () => showContainer(nbaContainer));
    wnbaLogo.addEventListener("click", () => showContainer(wnbaContainer));
    ncaamwLogo.addEventListener("click", () => showContainer(ncaamwContainer));
    ncaawLogo.addEventListener("click", () => showContainer(ncaawContainer));

    // Hide other containers and show the selected one
    function showContainer(container) {
        [nbaContainer, wnbaContainer, ncaamwContainer, ncaawContainer].forEach(c => c.classList.add("hidden"));
            container.classList.remove("hidden");
        }
    });
    