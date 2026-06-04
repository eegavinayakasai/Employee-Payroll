if (PayrollAuth.requireAuth()) {
    PayrollAuth.setupLogoutLinks();
    applySearchFromQuery();
}

const employeesTableBody = document.getElementById("employeesTableBody");
const searchEmployeesButton = document.getElementById("searchEmployeesButton");
const clearSearchButton = document.getElementById("clearSearchButton");

function employeeValue(value) {
    return value === null || value === undefined || value === "" ? "-" : value;
}

function renderEmployees(employees) {
    employeesTableBody.innerHTML = "";

    if (!employees.length) {
        employeesTableBody.innerHTML = '<tr><td colspan="10">No employees found.</td></tr>';
        return;
    }

    employees.forEach((employee) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${employeeValue(employee.id)}</td>
            <td>${employeeValue(employee.name)}</td>
            <td>${employeeValue(employee.email)}</td>
            <td>${employeeValue(employee.department)}</td>
            <td>${employeeValue(employee.designation)}</td>
            <td>${employeeValue(employee.employeeType)}</td>
            <td>${employeeValue(employee.baseSalary)}</td>
            <td>${employeeValue(employee.bankName)}</td>
            <td>${employeeValue(employee.accountNumber)}</td>
            <td>
                <select data-employee-action data-id="${employee.id}">
                    <option value="">Employee actions</option>
                    <option value="create">Create</option>
                    <option value="view">View</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                </select>
            </td>
        `;
        employeesTableBody.appendChild(row);
    });
}

async function loadEmployees() {
    try {
        const employees = await PayrollAuth.request("/api/employees");
        renderEmployees(employees);
    } catch (error) {
        renderEmployees([]);
    }
}

async function searchEmployees() {
    const id = document.getElementById("searchEmployeeId").value;

    if (id) {
        const employee = await PayrollAuth.request(`/api/employee/${id}`);
        renderEmployees([employee]);
        return;
    }

    const params = new URLSearchParams();
    const fields = {
        name: document.getElementById("searchName").value.trim(),
        email: document.getElementById("searchEmail").value.trim(),
        department: document.getElementById("searchDepartment").value.trim(),
        employeeType: document.getElementById("searchEmployeeType").value,
        designation: document.getElementById("searchDesignation").value.trim(),
        bankName: document.getElementById("searchBankName").value.trim(),
        accountNumber: document.getElementById("searchAccountNumber").value.trim(),
        minBaseSalary: document.getElementById("searchMinBaseSalary").value,
        maxBaseSalary: document.getElementById("searchMaxBaseSalary").value
    };

    Object.entries(fields).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });

    const url = params.toString() ? `/api/employees/search?${params.toString()}` : "/api/employees";
    const employees = await PayrollAuth.request(url);
    renderEmployees(employees);
}

function applySearchFromQuery() {
    const query = new URLSearchParams(window.location.search);
    const id = query.get("id");

    if (!query.toString()) {
        loadEmployees();
        return;
    }

    if (id) {
        PayrollAuth.request(`/api/employee/${id}`)
            .then((employee) => renderEmployees([employee]))
            .catch(() => renderEmployees([]));
        return;
    }

    document.getElementById("searchName").value = query.get("name") || "";
    document.getElementById("searchEmail").value = query.get("email") || "";
    document.getElementById("searchDepartment").value = query.get("department") || "";
    document.getElementById("searchEmployeeType").value = query.get("employeeType") || "";
    document.getElementById("searchDesignation").value = query.get("designation") || "";
    document.getElementById("searchBankName").value = query.get("bankName") || "";
    document.getElementById("searchAccountNumber").value = query.get("accountNumber") || "";
    document.getElementById("searchMinBaseSalary").value = query.get("minBaseSalary") || "";
    document.getElementById("searchMaxBaseSalary").value = query.get("maxBaseSalary") || "";

    searchEmployeesFromQuery(query).catch((error) => alert(error.message));
}

async function searchEmployeesFromQuery(query) {
    const params = new URLSearchParams();
    const supportedFields = [
        "name",
        "email",
        "department",
        "designation",
        "employeeType",
        "bankName",
        "accountNumber",
        "minBaseSalary",
        "maxBaseSalary"
    ];

    supportedFields.forEach((field) => {
        const value = query.get(field);

        if (value) {
            params.set(field, value);
        }
    });

    const url = params.toString() ? `/api/employees/search?${params.toString()}` : "/api/employees";
    const employees = await PayrollAuth.request(url);
    renderEmployees(employees);
}

async function deleteEmployee(id) {
    if (!confirm("Delete this employee?")) {
        return;
    }

    await PayrollAuth.request(`/api/employee/${id}`, {
        method: "DELETE"
    });

    loadEmployees();
}

searchEmployeesButton.addEventListener("click", searchEmployees);

clearSearchButton.addEventListener("click", () => {
    document.getElementById("searchEmployeeId").value = "";
    document.getElementById("searchName").value = "";
    document.getElementById("searchEmail").value = "";
    document.getElementById("searchDepartment").value = "";
    document.getElementById("searchEmployeeType").value = "";
    document.getElementById("searchDesignation").value = "";
    document.getElementById("searchBankName").value = "";
    document.getElementById("searchAccountNumber").value = "";
    document.getElementById("searchMinBaseSalary").value = "";
    document.getElementById("searchMaxBaseSalary").value = "";
    loadEmployees();
});

employeesTableBody.addEventListener("change", (event) => {
    const select = event.target.closest("[data-employee-action]");

    if (!select) {
        return;
    }

    const id = select.dataset.id;
    const action = select.value;

    if (action === "create") {
        window.location.href = "./employee-form.html";
    }

    if (action === "view" || action === "update") {
        window.location.href = `./employee-form.html?id=${id}`;
    }

    if (action === "delete") {
        deleteEmployee(id);
    }

    select.value = "";
});
