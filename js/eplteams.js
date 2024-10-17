document.addEventListener("DOMContentLoaded", function () {
    const teamsContainer = document.getElementById("teams-container");
    const apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams';
    const searchBar = document.getElementById("search-bar");

    let teams = []; // Store teams for search functionality

    function fetchTeams() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                teams = data.sports[0].leagues[0].teams; // Adjust based on actual response

                // Clear previous content
                teamsContainer.innerHTML = "";

                // Loop through the teams
                teams.forEach(item => {
                    const team = item.team; // Access the team object

                    const teamItem = document.createElement("div");
                    teamItem.classList.add("team-item");

                    // Set the logo image with the new class
                    teamItem.innerHTML = `
                        <img src="${team.logos[0].href}" alt="${team.displayName} logo" class="team-logo">
                        <h3>${team.displayName}</h3>
                        <p>Abbreviation: ${team.abbreviation || 'N/A'}</p>
                        <p>Venue: <a href="${team.links[0].href}" target="_blank">Visit Clubhouse</a></p>
                    `;

                    teamsContainer.appendChild(teamItem);
                });
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    }

    // Load teams when the page is ready
    fetchTeams();

    // Search functionality
    searchBar.addEventListener("input", function () {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredTeams = teams.filter(item => 
            item.team.displayName.toLowerCase().includes(searchTerm)
        );

        // Clear and display filtered teams
        teamsContainer.innerHTML = "";
        filteredTeams.forEach(item => {
            const team = item.team; // Access the team object

            const teamItem = document.createElement("div");
            teamItem.classList.add("team-item");

            // Set the logo image with the new class for the filtered teams
            teamItem.innerHTML = `
                <img src="${team.logos[0].href}" alt="${team.displayName} logo" class="team-logo">
                <h3>${team.displayName}</h3>
                <p>Abbreviation: ${team.abbreviation || 'N/A'}</p>
                <p>Venue: <a href="${team.links[0].href}" target="_blank">Visit Clubhouse</a></p>
            `;

            teamsContainer.appendChild(teamItem);
        });
    });
});
