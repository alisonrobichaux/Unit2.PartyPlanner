const COHORT = "2401-FTB-ET-WEB-FT";
const API = "https://your-api-base-url.com/api/events" + COHORT; 

const state = {
    events: []
}

const partyList = document.getElementById("party-list");
const partyForm = document.getElementById("party-form");

async function createEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API + "/events", {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                name: document.getElementById("name").value,
                description: document.getElementById("description").value,
                date: `${document.getElementById("date").value}:00.000Z`,
                location: document.getElementById("location").value,
            })
        });
        getEvents();
    } catch(err) {
        console.error(err);
    }
}

async function getEvents() {
    try {
        const response = await fetch(API + "/events");
        const json = await response.json();
        state.events = json.data;
        render();
    } catch(err) {
        console.error(err);
    }
}

function render() {
    const partyList = document.getElementById("party-list");
    partyList.innerHTML = ''; // Clear the existing content

    state.events.forEach(event => {
        const article = document.createElement("article");
        article.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.description}</p>
            <p>⏰ ${new Date(event.date).toDateString()}</p>
            <address>📍 ${event.location}</address>
            <button onclick="deleteEvent(${event.id})">X</button>
        `;
        partyList.appendChild(article);
    });
}

function deleteEvent(eventId) {
    fetch(API + `/events/${eventId}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            console.log("Event deleted!");
            getEvents();
        } else {
            console.error('Failed to delete event:', response.status);
        }
    })
    .catch(error => console.error('Error deleting event:', error));
}

async function getEvents() {
    try {
        const response = await fetch(API + "/events");

        if (!response.ok) {
            throw new Error(`Failed to fetch events. Status: ${response.status}`);
        }

        const json = await response.json();
        state.events = json.data;
        render();
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}