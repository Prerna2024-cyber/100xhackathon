document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded");

    let role = localStorage.getItem("userRole") || "user"; // Get role from storage

    // Role Selection for Login
    document.getElementById("user-btn")?.addEventListener("click", function () {
        role = "user";
        localStorage.setItem("userRole", "user");
        alert("User Login Selected");
    });

    document.getElementById("admin-btn")?.addEventListener("click", function () {
        role = "admin";
        localStorage.setItem("userRole", "admin");
        alert("Admin Login Selected");
    });

    // Login Form Submission
    document.getElementById("login-form")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const storedRole = localStorage.getItem("userRole") || "user";

        const endpoint = storedRole === "admin"
            ? "http://localhost:3000/api/v1/admin/signin"
            : "http://localhost:3000/api/v1/user/signin";

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Login API Response:", data);

            if (data.error) {
                alert("Login failed: " + data.error);
            } else {
                alert("Login successful!");
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userRole", storedRole);
                window.location.href = storedRole === "admin" ? "admin.html" : "user.html";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Server error, please try again.");
        });
    });

    // Authentication Check on Protected Pages
    const token = localStorage.getItem("authToken");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
        if (window.location.pathname.includes("admin.html") || window.location.pathname.includes("user.html")) {
            alert("Unauthorized! Redirecting to login...");
            window.location.href = "login.html";
        }
    } else if (window.location.pathname.includes("admin.html") && userRole !== "admin") {
        alert("Unauthorized Access! Redirecting...");
        window.location.href = "user.html";
    } else if (window.location.pathname.includes("user.html") && userRole !== "user") {
        alert("Unauthorized Access! Redirecting...");
        window.location.href = "admin.html";
    }

    // Role Selection for Registration
    document.getElementById("user-reg-btn")?.addEventListener("click", function () {
        role = "user";
        localStorage.setItem("userRole", "user");
        alert("User Registration Selected");
    });

    document.getElementById("admin-reg-btn")?.addEventListener("click", function () {
        role = "admin";
        localStorage.setItem("userRole", "admin");
        alert("Admin Registration Selected");
    });

    // Register Form Submission
    document.getElementById("register-form")?.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const selectedRole = localStorage.getItem("userRole") || "user";

        const endpoint = selectedRole === "user"
            ? "http://localhost:3000/api/v1/user/signup"
            : "http://localhost:3000/api/v1/admin/signup";

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, firstName, lastName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Registration failed: " + data.error);
            } else {
                alert("Registration successful!");
                localStorage.removeItem("userRole");
                window.location.href = "login.html";
            }
        })
        .catch(error => console.error("Error:", error));
    });

    // Fetch Hackathons
    fetchHackathons();

    // Fetch Leaderboard
    fetchLeaderboard();
});

// Fetch Hackathons from Backend
function fetchHackathons() {
    fetch("http://localhost:3000/api/v1/hackathon/preview")
        .then(response => response.json())
        .then(data => {
            const hackathonList = document.getElementById("hackathon-list");
            if (!hackathonList) return;
            hackathonList.innerHTML = "";

            if (data.hackathons && data.hackathons.length > 0) {
                data.hackathons.forEach(hackathon => {
                    const hackathonItem = document.createElement("div");
                    hackathonItem.classList.add("feature-card");
                    hackathonItem.innerHTML = `
                        <h3>${hackathon.title}</h3>
                        <p>${hackathon.description}</p>
                        <p>Prize: $${hackathon.prize}</p>
                    `;
                    hackathonList.appendChild(hackathonItem);
                });
            } else {
                hackathonList.innerHTML = "<p>No upcoming hackathons.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching hackathons:", error);
            document.getElementById("hackathon-list")?.innerHTML = "<p>Error loading hackathons.</p>";
        });
}

// Fetch Leaderboard
function fetchLeaderboard() {
    const leaderboardList = document.getElementById("leaderboard-list");
    if (!leaderboardList) return;

    fetch("http://localhost:3000/api/v1/leaderboard")
        .then(response => response.json())
        .then(data => {
            leaderboardList.innerHTML = "";

            if (data.winners && data.winners.length > 0) {
                data.winners.forEach((winner, index) => {
                    const winnerItem = document.createElement("div");
                    winnerItem.classList.add("leaderboard-item");
                    winnerItem.innerHTML = `
                        <h3>#${index + 1} ${winner.name}</h3>
                        <p>🏅 Prize: $${winner.prize}</p>
                    `;
                    leaderboardList.appendChild(winnerItem);
                });
            } else {
                leaderboardList.innerHTML = "<p>No winners yet.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching leaderboard:", error);
            leaderboardList.innerHTML = "<p>Error loading leaderboard.</p>";
        });
}
