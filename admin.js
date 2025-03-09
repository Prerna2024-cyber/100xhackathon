document.addEventListener("DOMContentLoaded", function () {
    fetchHackathons();

    document.getElementById("create-hackathon-form").addEventListener("submit", function (event) {
        event.preventDefault();
        createHackathon();
    });

    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("adminToken");
        window.location.href = "login.html";
    });
});

// Fetch all hackathons
function fetchHackathons() {
    fetch("http://localhost:3000/api/v1/hackathon/preview")
        .then(response => response.json())
        .then(data => {
            const hackathonList = document.getElementById("hackathon-list");
            hackathonList.innerHTML = "";

            if (data.hackathons && data.hackathons.length > 0) {
                data.hackathons.forEach(hackathon => {
                    const hackathonItem = document.createElement("div");
                    hackathonItem.classList.add("hackathon-item");
                    hackathonItem.innerHTML = `
                        <h3>${hackathon.title}</h3>
                        <p>${hackathon.description}</p>
                        <p>Prize: $${hackathon.prize}</p>
                        <button onclick="deleteHackathon('${hackathon._id}')" class="btn">Delete</button>
                    `;
                    hackathonList.appendChild(hackathonItem);
                });
            } else {
                hackathonList.innerHTML = "<p>No hackathons found.</p>";
            }
        })
        .catch(error => console.error("Error fetching hackathons:", error));
}

// Create a new hackathon
function createHackathon() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const prize = document.getElementById("prize").value;
    const date_of_start = document.getElementById("date_of_start").value;
    const date_of_submission = document.getElementById("date_of_submission").value;

    fetch("http://localhost:3000/api/v1/admin/hackathon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, prize, date_of_start, date_of_submission })
    })
    .then(response => response.json())
    .then(data => {
        alert("Hackathon created!");
        fetchHackathons();
    })
    .catch(error => console.error("Error creating hackathon:", error));
}

// Delete a hackathon
function deleteHackathon(hackathonId) {
    fetch(`http://localhost:3000/api/v1/admin/hackathon/${hackathonId}`, { method: "DELETE" })
    .then(response => response.json())
    .then(data => {
        alert("Hackathon deleted!");
        fetchHackathons();
    })
    .catch(error => console.error("Error deleting hackathon:", error));
}
