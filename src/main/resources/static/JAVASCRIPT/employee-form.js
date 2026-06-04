if (PayrollAuth.requireAuth()) {
    PayrollAuth.setupLogoutLinks();
    loadEmployeeFromQuery();
}

const employeeMessage = document.getElementById("employeeFormMessage");
const saveEmployeeButton = document.getElementById("saveEmployeeButton");
const updateEmployeeButton = document.getElementById("updateEmployeeButton");
const resetEmployeeButton = document.getElementById("resetEmployeeButton");
let currentEmployeeId = new URLSearchParams(window.location.search).get("id");
const employeeRequiredFields = ["name", "email", "department", "employeeType", "baseSalary"];

PayrollAuth.setupRequiredFieldReset(employeeRequiredFields);

function getEmployeePayload() {
    return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        department: document.getElementById("department").value.trim(),
        designation: document.getElementById("designation").value.trim(),
        employeeType: document.getElementById("employeeType").value,
        baseSalary: Number(document.getElementById("baseSalary").value),
        bankName: document.getElementById("bankName").value.trim(),
        accountNumber: document.getElementById("accountNumber").value.trim()
    };
}

function setEmployeeMessage(message) {
    employeeMessage.textContent = message;
}

function validateEmployee(payload) {
    if (!PayrollAuth.validateRequiredFields(employeeRequiredFields)) {
        setEmployeeMessage("Name, email, department, employee type, and base salary are required.");
        return false;
    }

    return true;
}

function fillEmployee(employee) {
    currentEmployeeId = employee.id || currentEmployeeId;
    document.getElementById("name").value = employee.name || "";
    document.getElementById("email").value = employee.email || "";
    document.getElementById("department").value = employee.department || "";
    document.getElementById("designation").value = employee.designation || "";
    document.getElementById("employeeType").value = employee.employeeType || "";
    document.getElementById("baseSalary").value = employee.baseSalary || "";
    document.getElementById("bankName").value = employee.bankName || "";
    document.getElementById("accountNumber").value = employee.accountNumber || "";
}

async function loadEmployeeFromQuery() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        return;
    }

    try {
        const employee = await PayrollAuth.request(`/api/employee/${id}`);
        fillEmployee(employee);
    } catch (error) {
        setEmployeeMessage(error.message);
    }
}

async function saveEmployee() {
    const payload = getEmployeePayload();

    if (!validateEmployee(payload)) {
        return;
    }

    const employee = await PayrollAuth.request("/api/employee", {
        method: "POST",
        body: JSON.stringify(payload)
    });

    fillEmployee(employee);
    setEmployeeMessage("Employee saved successfully.");
}

async function updateEmployee() {
    const payload = getEmployeePayload();

    if (!currentEmployeeId) {
        setEmployeeMessage("Open an employee from the Employees page before updating.");
        return;
    }

    if (!validateEmployee(payload)) {
        return;
    }

    const employee = await PayrollAuth.request(`/api/employee/${currentEmployeeId}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });

    fillEmployee(employee);
    setEmployeeMessage("Employee updated successfully.");
}

saveEmployeeButton.addEventListener("click", () => {
    saveEmployee().catch((error) => setEmployeeMessage(error.message));
});

updateEmployeeButton.addEventListener("click", () => {
    updateEmployee().catch((error) => setEmployeeMessage(error.message));
});

resetEmployeeButton.addEventListener("click", () => {
    document.querySelectorAll("input, select").forEach((field) => {
        field.value = "";
        field.classList.remove("invalid");
    });
    currentEmployeeId = null;
    setEmployeeMessage("");
});
