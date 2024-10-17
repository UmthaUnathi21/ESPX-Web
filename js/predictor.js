// Define the API URL for the 2023-24 English Premier League season
const apiURL2023 = 'https://site.web.api.espn.com/apis/v2/sports/soccer/eng.1/standings?season=2023';

// Function to fetch the EPL data for the 2023-24 season
async function fetchEPLData2023() {
    try {
        // Fetch data from the API endpoint
        const response = await fetch(apiURL2023);
        // Parse the response data as JSON
        const data = await response.json();

        // Array to store information about the teams
        const teamsData = [];

        // Loop through each team's standings data
        data.children[0].standings.entries.forEach((team, index) => {
            // Get the display name of the team
            const teamName = team.team.displayName;

            // Find the stats for goals scored and number of wins
            const goalsScoredStat = team.stats.find(stat => stat.name === "pointsFor"); // 'pointsFor' represents goals scored
            const winsStat = team.stats.find(stat => stat.name === "wins"); // 'wins' represents the number of wins

            // If any of the required stats are missing, log an error and skip this team
            if (!goalsScoredStat || !winsStat) {
                console.error(`Stats missing for ${teamName}`);
                return;
            }

            // Store the actual values of goals scored and wins
            const goalsScored = goalsScoredStat.value;
            const wins = winsStat.value;

            // Add the team's data (position, name, goals, and wins) to the array
            teamsData.push({
                position: index + 1, // Position in the league table, starts at 1 (index + 1)
                team: teamName,      // Team name
                goals: goalsScored,  // Goals scored by the team
                wins: wins           // Number of wins
            });
        });

        // Call the function to render the table with the teams data
        renderTable(teamsData);

    } catch (error) {
        // Log any errors that occur during the API call or data processing
        console.error('Error fetching EPL data:', error);
    }
}

function renderTable(teamsData) {
    // Select the table body element where rows will be dynamically added
    const tableBody = document.querySelector("#epl-table tbody");

    // Clear any existing content in the table before adding new rows
    tableBody.innerHTML = '';

    // Loop through the teams data and create a row for each team
    teamsData.forEach(team => {
        // Create a new table row element
        const row = document.createElement("tr");

        // Apply different styles or tooltips based on the team's position
        if (team.position >= 1 && team.position <= 4) {
            // Top 4 teams qualify for the Champions League
            row.classList.add('champions-league');
            row.setAttribute('title', 'Champions League - Qualified');
        } else if (team.position >= 5 && team.position <= 6) {
            // Teams ranked 5th and 6th qualify for the Europa League
            row.classList.add('europa-league');
            row.setAttribute('title', 'Europa League - Qualified');
        } else if (team.position >= 18 && team.position <= 20) {
            // Teams ranked 18th to 20th are relegated
            row.classList.add('relegated');
            row.setAttribute('title', 'English Football League - Relegated');
        }

        // Populate the row with the team's data: position, name, goals, and wins
        row.innerHTML = `
            <td>${team.position}</td>
            <td>${team.team}</td>
            <td>${team.goals}</td>
            <td>${team.wins}</td>
        `;

        // Add the row to the table body in the DOM
        tableBody.appendChild(row);
    });
}


// Call the function to fetch and display the EPL data for the 2023-24 season
fetchEPLData2023();
