// Define the API URL for fetching EPL (English Premier League) standings data
const apiURL = 'https://site.web.api.espn.com/apis/v2/sports/soccer/eng.1/standings?season=2022';

// Function to fetch EPL data from the API
async function fetchEPLData() {
    try {
        // Fetch data from the API
        const response = await fetch(apiURL);
        const data = await response.json(); // Parse the response as JSON

        // Initialize an empty array to store processed team data
        const teamsData = [];

        // Loop through each team's standings data
        data.children[0].standings.entries.forEach(team => {
            const teamName = team.team.displayName; // Extract the team name

            // Find the stats for goals scored and wins
            const goalsScoredStat = team.stats.find(stat => stat.name === "pointsFor"); // Goals scored
            const winsStat = team.stats.find(stat => stat.name === "wins"); // Wins

            // If either the goals or wins stats are missing, skip this team
            if (!goalsScoredStat || !winsStat) {
                console.error(`Stats missing for ${teamName}`); // Log the missing data for debugging
                return;  // Exit the loop for this team and continue with the next
            }

            // Extract goals scored and wins values
            const goalsScored = goalsScoredStat.value;
            const wins = winsStat.value;

            // Add the team's name, goals, and wins to the teamsData array
            teamsData.push({
                team: teamName,
                goals: goalsScored,
                wins: wins
            });
        });

        // After fetching and processing all teams' data, render the chart
        renderChart(teamsData); // Pass the processed data to the render function

    } catch (error) {
        // Log any errors that occur during the fetch process
        console.error('Error fetching EPL data:', error);
    }
}

// Function to render the chart using the provided team data
function renderChart(teamsData) {
    // Select the SVG element where the chart will be rendered
    const svg = d3.select("svg");
    const width = +svg.attr("width"); // Get the SVG's width attribute
    const height = +svg.attr("height"); // Get the SVG's height attribute

    // Set margins for the chart
    const margin = {top: 20, right: 30, bottom: 40, left: 50};
    const chartWidth = width - margin.left - margin.right; // Calculate chart width
    const chartHeight = height - margin.top - margin.bottom; // Calculate chart height

    // Create a group element to hold the chart components, applying margins
    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the X scale (for goals scored)
    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(teamsData, d => d.goals)]) // Set domain from 0 to the max goals scored
                     .nice() // Adjust the scale for better tick marks
                     .range([0, chartWidth]); // Map to the available chart width

    // Define the Y scale (for wins)
    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(teamsData, d => d.wins)]) // Set domain from 0 to the max wins
                     .nice() // Adjust the scale for better tick marks
                     .range([chartHeight, 0]); // Map to the available chart height (invert the Y-axis)

    // Create and append the X-axis (for goals scored)
    const xAxis = d3.axisBottom(xScale); // X-axis at the bottom
    g.append("g")
     .attr("transform", `translate(0,${chartHeight})`) // Position at the bottom of the chart
     .call(xAxis) // Add the X-axis
     .append("text") // Add label for the X-axis
     .attr("x", chartWidth) // Position the label at the end of the axis
     .attr("y", 35) // Position the label slightly below the axis
     .attr("fill", "black") // Text color
     .attr("text-anchor", "end") // Align text to the end
     .text("Goals Scored"); // Label text

    // Create and append the Y-axis (for wins)
    const yAxis = d3.axisLeft(yScale); // Y-axis on the left
    g.append("g")
     .call(yAxis) // Add the Y-axis
     .append("text") // Add label for the Y-axis
     .attr("x", -10) // Position the label slightly left of the axis
     .attr("y", -10) // Position the label slightly above the axis
     .attr("fill", "black") // Text color
     .attr("text-anchor", "end") // Align text to the end
     .text("Wins"); // Label text

    // Optional: Add colored sections for categorizing teams (elite, middle, poor)
    // Elite section
    g.append("rect")
     .attr("x", xScale(60)) // X position based on goals scored
     .attr("y", yScale(18)) // Y position based on wins
     .attr("width", chartWidth - xScale(60)) // Width of the section
     .attr("height", yScale(18)) // Height of the section
     .attr("class", "elite-section"); // Add a CSS class for styling

    // Middle section
    g.append("rect")
     .attr("x", xScale(40))
     .attr("y", yScale(10))
     .attr("width", xScale(60) - xScale(40))
     .attr("height", yScale(10) - yScale(18))
     .attr("class", "middle-section");

    // Poor section
    g.append("rect")
     .attr("x", 0)
     .attr("y", yScale(10))
     .attr("width", xScale(40))
     .attr("height", chartHeight - yScale(10))
     .attr("class", "poor-section");

    // Create a tooltip for displaying data on hover
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute") // Make the tooltip follow the cursor
        .style("background-color", "white") // Set the tooltip background
        .style("border", "solid") // Add a border
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px") // Padding inside the tooltip
        .style("display", "none"); // Initially hide the tooltip

    // Bind data to images (team logos) and display them on the chart
    g.selectAll("image")
     .data(teamsData) // Bind the teamsData array
     .enter()
     .append("image")
     .attr("xlink:href", d => `../logos/${d.team.toLowerCase().replace(/ /g, "-").replace("&", "and")}.png`) // Set team logo image source dynamically
     .attr("x", d => xScale(d.goals) - 15)  // X position for the image (center it on the X axis)
     .attr("y", d => yScale(d.wins) - 15)  // Y position for the image (center it on the Y axis)
     .attr("width", 30)  // Set image width
     .attr("height", 30) // Set image height
     .on("mouseover", (event, d) => { // Show tooltip on hover
         tooltip
             .style("left", `${event.pageX + 10}px`) // Position tooltip near cursor
             .style("top", `${event.pageY - 10}px`)
             .style("display", "inline-block") // Display the tooltip
             .html(`<strong>${d.team}</strong><br>Goals: ${d.goals}<br>Wins: ${d.wins}`); // Display team info
     })
     .on("mouseout", () => tooltip.style("display", "none")); // Hide tooltip when mouse leaves the image

    // Animate logos to fade in smoothly
    g.selectAll("image")
     .data(teamsData) // Re-bind the data
     .enter()
     .append("image")
     .attr("xlink:href", d => `../logos/${d.team.toLowerCase().replace(/ /g, "-").replace("&", "and")}.png`) // Logo source
     .attr("x", d => xScale(d.goals) - 15)  // X position
     .attr("y", d => yScale(d.wins) - 15)  // Y position
     .attr("width", 30)  // Set logo width
     .attr("height", 30) // Set logo height
     .attr("opacity", 0)  // Initially invisible
     .transition()  // Begin a transition for animation
     .duration(1000)  // Duration of 1 second
     .attr("opacity", 1);  // Fade the logos in
}

// Array of match scores for the 2022-23 EPL season
const scores = [
    "Man City 2-0 Arsenal",
    "Liverpool 1-1 Chelsea",
    "Tottenham 3-2 Man United",
    "Leicester 1-0 Southampton",
    "Everton 2-3 West Ham",
    "Crystal Palace 1-1 Nottm Forest",
    "Leicester City 2-1 West Ham",
    "Leeds 1-4 Tottenham", 
    "Wolves 1-0 Aston Villa",
    "Bournemouth 2-0 Brighton",
];

// Function to update the ticker text
function updateTicker() {
    const tickerText = document.getElementById('ticker-text');
    tickerText.textContent = scores.join('  |  ');
}

// Call the updateTicker function when the page loads
document.addEventListener('DOMContentLoaded', updateTicker);


// Fetch the data and render the chart
fetchEPLData();

// Fetch breaking news from ESPN API
async function fetchBreakingNews() {
    try {
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard');
        const data = await response.json();
        
        // Extract news items from the data
        const newsItems = data.events.map(event => {
            const homeTeam = event.competitions[0].competitors[0].team.name;
            const awayTeam = event.competitions[0].competitors[1].team.name;
            const score = event.status.displayClock || 'Scheduled';
            return `${homeTeam} vs ${awayTeam} - ${score}`;
        });
        
        // Display news in the HTML
        const newsContainer = document.getElementById('breaking-news');
        newsContainer.innerHTML = newsItems.join('<br>');
    } catch (error) {
        console.error('Error fetching breaking news:', error);
    }
}

// Call the function to fetch and display news
fetchBreakingNews();

