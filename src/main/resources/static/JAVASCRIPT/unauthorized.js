const user = PayrollAuth.getUser();

if (!PayrollAuth.getToken()) {
    document.querySelector("p").textContent = "Please login before opening protected pages.";
} else if (user.role) {
    document.querySelector("p").textContent = `Your current role (${user.role}) cannot access this action.`;
}
