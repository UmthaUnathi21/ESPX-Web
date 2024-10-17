document.addEventListener("DOMContentLoaded", function () {
    const calendarContainer = document.getElementById("calendar-container");
    const matchListContainer = document.getElementById("match-list-container");
    const apiUrl = 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard';
    const months = [
        { month: 'September', days: 30 },
        { month: 'October', days: 31 }
    ];
    let currentIndex = 0; // Start with the current week
    const dates = generateDates();
    
    // Array of match days
    const matchDays = [
        '2024-08-16', '2024-08-17', '2024-08-24', '2024-08-25', '2024-08-31',
        '2024-09-01', '2024-09-14', '2024-09-15', '2024-09-21', '2024-09-22',
        '2024-09-28', '2024-09-29', '2024-09-30',
        '2024-10-05', '2024-10-06'
    ];

    function generateDates() {
        const dateList = [];
        const startDate = new Date('2024-09-01');

        months.forEach(monthObj => {
            for (let i = 1; i <= monthObj.days; i++) {
                const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), i);
                dateList.push(currentDate);
            }
            startDate.setMonth(startDate.getMonth() + 1); // Move to the next month
        });

        return dateList;
    }

    function fetchScores(date) {
        // Clear previous matches
        matchListContainer.innerHTML = ""; 
        const selectedDate = new Date(date).toISOString().split('T')[0];

        // Check if the selected date is a match day
        if (matchDays.includes(selectedDate)) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const events = data.events;

                    // Filter events to match the selected date
                    events.forEach(event => {
                        const matchDate = new Date(event.date).toISOString().split('T')[0];
                        if (matchDays.includes(matchDate)) {
                            const homeTeam = event.competitions[0].competitors[0].team.displayName;
                            const awayTeam = event.competitions[0].competitors[1].team.displayName;
                            const homeScore = event.competitions[0].competitors[0].score;
                            const awayScore = event.competitions[0].competitors[1].score;

                            const matchItem = document.createElement("div");
                            matchItem.classList.add("match-item");
                            matchItem.innerHTML = `
                                <span>${homeTeam} ${homeScore} - ${awayScore} ${awayTeam} (Date: ${matchDate})</span>
                            `;
                            matchListContainer.appendChild(matchItem);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            matchListContainer.innerHTML = '<span>No matches on this date.</span>';
        }
    }

    function displayWeek(startIndex) {
        const week = dates.slice(startIndex, startIndex + 7);
        calendarContainer.innerHTML = '';

        week.forEach(date => {
            const dateString = date.toISOString().split('T')[0];
            const dayButton = document.createElement("button");
            dayButton.classList.add("calendar-day");
            dayButton.innerText = `${date.getDate()} ${months[date.getMonth() - 8].month}`;
            dayButton.addEventListener("click", () => fetchScores(dateString));
            calendarContainer.appendChild(dayButton);
        });
    }

    // Event listeners for navigation
    document.getElementById('prevWeek').addEventListener('click', () => {
        if (currentIndex >= 7) {
            currentIndex -= 7;
            displayWeek(currentIndex);
        }
    });

    document.getElementById('nextWeek').addEventListener('click', () => {
        if (currentIndex + 7 < dates.length) {
            currentIndex += 7;
            displayWeek(currentIndex);
        }
    });

    // Toggle full calendar view
    document.getElementById('calendarIcon').addEventListener('click', () => {
        calendarContainer.innerHTML = '';
        dates.forEach(date => {
            const dateElement = document.createElement('div');
            dateElement.classList.add('calendar-date');
            dateElement.innerText = `${date.getDate()} ${months[date.getMonth() - 8].month}`;
            calendarContainer.appendChild(dateElement);
        });
    });

    // Initially display the current week
    const today = new Date();
    const todayIndex = dates.findIndex(date => date.toDateString() === today.toDateString());
    currentIndex = todayIndex - 3; // Show 3 days before and 3 days after
    displayWeek(currentIndex);
    fetchScores(today.toISOString().split('T')[0]);
});
