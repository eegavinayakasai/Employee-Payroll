const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const loginRequiredFields = ["username", "password"];

PayrollAuth.setupRequiredFieldReset(loginRequiredFields);

function showLoginMessage(message) {
    loginMessage.textContent = message;
}

async function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!PayrollAuth.validateRequiredFields(loginRequiredFields)) {
        showLoginMessage("Username and password are required.");
        return;
    }

    loginButton.disabled = true;
    showLoginMessage("Logging in...");

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showLoginMessage(data.message || "Invalid username or password.");
            return;
        }

        PayrollAuth.setSession(data);
        window.location.href = "./dashboard.html";
    } catch (error) {
        showLoginMessage("Unable to connect to the server.");
    } finally {
        loginButton.disabled = false;
    }
}

loginButton.addEventListener("click", login);

[usernameInput, passwordInput].forEach((input) => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            login();
        }
    });
});
