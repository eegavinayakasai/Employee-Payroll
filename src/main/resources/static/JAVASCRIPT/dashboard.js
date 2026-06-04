const totalEmployees = document.getElementById("totalEmployees");
const totalPayrolls = document.getElementById("totalPayrolls");
const currentUser = document.getElementById("currentUser");
const dashboardEmployeeSearchButton = document.getElementById("dashboardEmployeeSearchButton");

if (PayrollAuth.requireAuth()) {
    PayrollAuth.setupLogoutLinks();

    const user = PayrollAuth.getUser();
    currentUser.textContent = `${user.username || "Unknown"} (${user.role || "Unknown"})`;

    loadDashboard();
}

function searchEmployeeFromDashboard() {
    const params = new URLSearchParams();
    const fields = {
        id: document.getElementById("dashboardEmployeeId").value,
        name: document.getElementById("dashboardEmployeeName").value.trim(),
        email: document.getElementById("dashboardEmployeeEmail").value.trim(),
        department: document.getElementById("dashboardEmployeeDepartment").value.trim(),
        designation: document.getElementById("dashboardEmployeeDesignation").value.trim(),
        employeeType: document.getElementById("dashboardEmployeeType").value,
        bankName: document.getElementById("dashboardBankName").value.trim(),
        accountNumber: document.getElementById("dashboardAccountNumber").value.trim(),
        minBaseSalary: document.getElementById("dashboardMinBaseSalary").value,
        maxBaseSalary: document.getElementById("dashboardMaxBaseSalary").value
    };

    Object.entries(fields).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });

    if (!params.toString()) {
        window.location.href = "./employees.html";
        return;
    }

    window.location.href = `./employees.html?${params.toString()}`;
}

dashboardEmployeeSearchButton.addEventListener("click", searchEmployeeFromDashboard);

document.querySelectorAll("main section:nth-child(3) input, main section:nth-child(3) select").forEach((field) => {
    field.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchEmployeeFromDashboard();
        }
    });
});

async function loadDashboard() {
    try {
        const employees = await PayrollAuth.request("/api/employees");
        const payrolls = await PayrollAuth.request("/api/payrolls");

        totalEmployees.textContent = employees.length;
        totalPayrolls.textContent = payrolls.length;
    } catch (error) {
        totalEmployees.textContent = "0";
        totalPayrolls.textContent = "0";
    }
}
