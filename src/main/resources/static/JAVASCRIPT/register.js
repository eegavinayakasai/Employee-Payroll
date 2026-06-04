const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const roleSelect = document.getElementById("role");
const registerButton = document.getElementById("registerButton");
const registerMessage = document.getElementById("registerMessage");
const registerRequiredFields = ["username", "password", "role"];

PayrollAuth.setupRequiredFieldReset(registerRequiredFields);

function showRegisterMessage(message) {
    registerMessage.textContent = message;
}

async function registerUser() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    // const role = roleSelect.value;

    if (!PayrollAuth.validateRequiredFields(registerRequiredFields)) {
        showRegisterMessage("Username and password are required.");
        return;
    }

    registerButton.disabled = true;
    showRegisterMessage("Registering user...");

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password})
        });

        const data = await response.json();

        if (!response.ok) {
            showRegisterMessage(data.message || "Registration failed.");
            return;
        }

        showRegisterMessage("Registration successful. You can login now.");
        usernameInput.value = "";
        passwordInput.value = "";
        roleSelect.value = "";
    } catch (error) {
        showRegisterMessage("Unable to connect to the server.");
    } finally {
        registerButton.disabled = false;
    }
}

registerButton.addEventListener("click", registerUser);
