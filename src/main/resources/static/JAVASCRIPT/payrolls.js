if (PayrollAuth.requireAuth()) {
    PayrollAuth.setupLogoutLinks();
    loadPayrolls();
}

const payrollsTableBody = document.getElementById("payrollsTableBody");
const findPayrollsButton = document.getElementById("findPayrollsButton");
const loadAllPayrollsButton = document.getElementById("loadAllPayrollsButton");

function payrollValue(value) {
    return value === null || value === undefined || value === "" ? "-" : value;
}

function renderPayrolls(payrolls) {
    payrollsTableBody.innerHTML = "";

    if (!payrolls.length) {
        payrollsTableBody.innerHTML = '<tr><td colspan="12">No payrolls found.</td></tr>';
        return;
    }

    payrolls.forEach((payroll) => {
        const employee = payroll.employee || {};
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${payrollValue(payroll.id)}</td>
            <td>${payrollValue(employee.id)}</td>
            <td>${payrollValue(employee.name)}</td>
            <td>${payrollValue(payroll.month)}</td>
            <td>${payrollValue(payroll.year)}</td>
            <td>${payrollValue(payroll.baseSalary)}</td>
            <td>${payrollValue(payroll.bonus)}</td>
            <td>${payrollValue(payroll.deductions)}</td>
            <td>${payrollValue(payroll.totalWorkingDays)}</td>
            <td>${payrollValue(payroll.daysPresent)}</td>
            <td>${payrollValue(payroll.netSalary)}</td>
            <td>
                <select data-payroll-action data-id="${payroll.id}">
                    <option value="">Payroll actions</option>
                    <option value="create">Create</option>
                    <option value="view">View</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                </select>
            </td>
        `;
        payrollsTableBody.appendChild(row);
    });
}

async function loadPayrolls() {
    try {
        const payrolls = await PayrollAuth.request("/api/payrolls");
        renderPayrolls(payrolls);
    } catch (error) {
        renderPayrolls([]);
    }
}

async function loadPayrollsByEmployee() {
    const payrollId = document.getElementById("payrollId").value;
    const employeeId = document.getElementById("employeeId").value;
    const employeeName = document.getElementById("employeeName").value.trim().toLowerCase();
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const minNetSalary = document.getElementById("minNetSalary").value;
    const maxNetSalary = document.getElementById("maxNetSalary").value;

    if (payrollId) {
        const payroll = await PayrollAuth.request(`/api/payroll/${payrollId}`);
        renderPayrolls([payroll]);
        return;
    }

    let payrolls = employeeId
        ? await PayrollAuth.request(`/api/employee/${employeeId}/payrolls`)
        : await PayrollAuth.request("/api/payrolls");

    payrolls = payrolls.filter((payroll) => {
        const employee = payroll.employee || {};

        if (employeeName && !String(employee.name || "").toLowerCase().includes(employeeName)) {
            return false;
        }

        if (month && payroll.month !== month) {
            return false;
        }

        if (year && Number(payroll.year) !== Number(year)) {
            return false;
        }

        if (minNetSalary && Number(payroll.netSalary) < Number(minNetSalary)) {
            return false;
        }

        if (maxNetSalary && Number(payroll.netSalary) > Number(maxNetSalary)) {
            return false;
        }

        return true;
    });

    renderPayrolls(payrolls);
}

async function deletePayroll(id) {
    if (!confirm("Delete this payroll?")) {
        return;
    }

    await PayrollAuth.request(`/api/payroll/${id}`, {
        method: "DELETE"
    });

    loadPayrolls();
}

findPayrollsButton.addEventListener("click", () => {
    loadPayrollsByEmployee().catch((error) => alert(error.message));
});

loadAllPayrollsButton.addEventListener("click", () => {
    document.getElementById("payrollId").value = "";
    document.getElementById("employeeId").value = "";
    document.getElementById("employeeName").value = "";
    document.getElementById("month").value = "";
    document.getElementById("year").value = "";
    document.getElementById("minNetSalary").value = "";
    document.getElementById("maxNetSalary").value = "";
    loadPayrolls();
});

payrollsTableBody.addEventListener("change", (event) => {
    const select = event.target.closest("[data-payroll-action]");

    if (!select) {
        return;
    }

    const id = select.dataset.id;
    const action = select.value;

    if (action === "create") {
        window.location.href = "./payroll-form.html";
    }

    if (action === "view" || action === "update") {
        window.location.href = `./payroll-form.html?id=${id}`;
    }

    if (action === "delete") {
        deletePayroll(id).catch((error) => alert(error.message));
    }

    select.value = "";
});
