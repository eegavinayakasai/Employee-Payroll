(function () {
    const TOKEN_KEY = "employeePayrollToken";
    const USERNAME_KEY = "employeePayrollUsername";
    const ROLE_KEY = "employeePayrollRole";

    function getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function setSession(data) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USERNAME_KEY, data.username);
        localStorage.setItem(ROLE_KEY, data.role);
    }

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(ROLE_KEY);
    }

    function getUser() {
        return {
            username: localStorage.getItem(USERNAME_KEY),
            role: localStorage.getItem(ROLE_KEY)
        };
    }

    function requireAuth() {
        if (!getToken()) {
            window.location.href = "./login.html";
            return false;
        }

        return true;
    }

    function logout() {
        clearSession();
        window.location.href = "./login.html";
    }

    async function request(url, options = {}) {
        const headers = new Headers(options.headers || {});
        const token = getToken();

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        if (options.body && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            clearSession();
            window.location.href = "./login.html";
            throw new Error("Unauthorized");
        }

        if (response.status === 403) {
            window.location.href = "./unauthorized.html";
            throw new Error("Forbidden");
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;

        if (!response.ok) {
            throw new Error(data && data.message ? data.message : "Request failed");
        }

        return data;
    }

    function setupLogoutLinks() {
        document.querySelectorAll('a[href="./login.html"]').forEach((link) => {
            if (link.textContent.trim().toLowerCase() === "logout") {
                link.addEventListener("click", (event) => {
                    event.preventDefault();
                    logout();
                });
            }
        });
    }

    function setupNavigationSelects() {
        document.querySelectorAll("[data-nav-select]").forEach((select) => {
            select.addEventListener("change", () => {
                if (select.value) {
                    window.location.href = select.value;
                }
            });
        });
    }

    function setInvalid(field, invalid) {
        if (!field) {
            return;
        }

        field.classList.toggle("invalid", invalid);
    }

    function validateRequiredFields(fieldIds) {
        let isValid = true;

        fieldIds.forEach((id) => {
            const field = document.getElementById(id);
            const isBlank = !field || String(field.value).trim() === "";

            setInvalid(field, isBlank);

            if (isBlank) {
                isValid = false;
            }
        });

        return isValid;
    }

    function setupRequiredFieldReset(fieldIds) {
        fieldIds.forEach((id) => {
            const field = document.getElementById(id);

            if (!field) {
                return;
            }

            field.addEventListener("input", () => setInvalid(field, String(field.value).trim() === ""));
            field.addEventListener("change", () => setInvalid(field, String(field.value).trim() === ""));
        });
    }

    window.PayrollAuth = {
        getToken,
        setSession,
        clearSession,
        getUser,
        requireAuth,
        logout,
        request,
        setupLogoutLinks,
        setupNavigationSelects,
        validateRequiredFields,
        setupRequiredFieldReset,
        setInvalid
    };
})();
