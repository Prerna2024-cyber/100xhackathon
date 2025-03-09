document.addEventListener("DOMContentLoaded", function () {
    fetchHackathons();

    document.getElementById("logout-btn").addEventListener("click", function () {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        alert("Logged out successfully!");
        window.location.href = "login.html";
    });

    document.getElementById("submission-form").addEventListener("submit", function (event) {
        event.preventDefault();
        submitProject();
    });
});

// Fetch hackathons
function fetchHackathons() {
    fetch("http://localhost:3000/api/v1/hackathon/preview")
        .then(response => response.json())
        .then(data => {
            const hackathonList = document.getElementById("hackathon-list");
            const hackathonDropdown = document.getElementById("hackathonId");

            hackathonList.innerHTML = "";
            hackathonDropdown.innerHTML = '<option value="">Select Hackathon</option>';

            if (data.hackathons && data.hackathons.length > 0) {
                data.hackathons.forEach(hackathon => {
                    // Display in hackathon list
                    const hackathonItem = document.createElement("div");
                    hackathonItem.classList.add("hackathon-item");
                    hackathonItem.innerHTML = `
                        <h3>${hackathon.title}</h3>
                        <p>${hackathon.description}</p>
                        <p>Prize: $${hackathon.prize}</p>
                        <button onclick="participateHackathon('${hackathon._id}')" class="btn btn-primary">Participate</button>
                    `;
                    hackathonList.appendChild(hackathonItem);

                    // Add to submission dropdown
                    const option = document.createElement("option");
                    option.value = hackathon._id;
                    option.textContent = hackathon.title;
                    hackathonDropdown.appendChild(option);
                });
            } else {
                hackathonList.innerHTML = "<p>No hackathons available.</p>";
            }
        })
        .catch(error => console.error("Error fetching hackathons:", error));
}

// Participate in a hackathon
function participateHackathon(hackathonId) {
    const token = localStorage.getItem("authToken");

    fetch("http://localhost:3000/api/v1/user/participate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ hackathonId })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Successfully registered for the hackathon!");
    })
    .catch(error => console.error("Error participating:", error));
}

// Submit a project
function submitProject() {
    const token = localStorage.getItem("authToken");
    const hackathonId = document.getElementById("hackathonId").value;
    const submissionLink = document.getElementById("submissionLink").value;

    if (!hackathonId) {
        alert("Please select a hackathon!");
        return;
    }

    fetch("http://localhost:3000/api/v1/user/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ hackathonId, submissionLink })
    })
    .then(response => response.json())
    .then(data => {
        alert("Project submitted successfully!");
        document.getElementById("submission-form").reset();
    })
    .catch(error => console.error("Error submitting project:", error));
}
