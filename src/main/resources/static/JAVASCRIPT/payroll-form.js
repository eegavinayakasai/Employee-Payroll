if (PayrollAuth.requireAuth()) {
    PayrollAuth.setupLogoutLinks();
    loadPayrollFromQuery();
}

const payrollMessage = document.getElementById("payrollFormMessage");
const savePayrollButton = document.getElementById("savePayrollButton");
const updatePayrollButton = document.getElementById("updatePayrollButton");
const resetPayrollButton = document.getElementById("resetPayrollButton");
const payrollRequiredFields = ["totalWorkingDays", "month", "year"];

PayrollAuth.setupRequiredFieldReset(["employeeId", ...payrollRequiredFields]);

function setPayrollMessage(message) {
    payrollMessage.textContent = message;
}

function numberOrNull(id) {
    const value = document.getElementById(id).value;
    return value === "" ? null : Number(value);
}

function getPayrollPayload() {
    return {
        baseSalary: numberOrNull("baseSalary"),
        bonus: numberOrNull("bonus"),
        deductions: numberOrNull("deductions"),
        totalWorkingDays: numberOrNull("totalWorkingDays"),
        daysPresent: numberOrNull("daysPresent"),
        month: document.getElementById("month").value,
        year: numberOrNull("year")
    };
}

function validatePayroll(payload, employeeIdRequired) {
    const requiredFields = employeeIdRequired
        ? ["employeeId", ...payrollRequiredFields]
        : payrollRequiredFields;

    if (!PayrollAuth.validateRequiredFields(requiredFields)) {
        setPayrollMessage(employeeIdRequired
            ? "Employee ID, total working days, month, and year are required."
            : "Total working days, month, and year are required.");
        return false;
    }

    return true;
}

function fillPayroll(payroll) {
    document.getElementById("payrollId").value = payroll.id || "";
    document.getElementById("employeeId").value = payroll.employee && payroll.employee.id ? payroll.employee.id : "";
    document.getElementById("baseSalary").value = payroll.baseSalary || "";
    document.getElementById("bonus").value = payroll.bonus || "";
    document.getElementById("deductions").value = payroll.deductions || "";
    document.getElementById("totalWorkingDays").value = payroll.totalWorkingDays || "";
    document.getElementById("daysPresent").value = payroll.daysPresent || "";
    document.getElementById("month").value = payroll.month || "";
    document.getElementById("year").value = payroll.year || "";
}

async function loadPayrollFromQuery() {
    const id = new URLSearchParams(window.location.search).get("id");

    if (!id) {
        return;
    }

    try {
        const payroll = await PayrollAuth.request(`/api/payroll/${id}`);
        fillPayroll(payroll);
    } catch (error) {
        setPayrollMessage(error.message);
    }
}

async function savePayroll() {
    const employeeId = document.getElementById("employeeId").value;
    const payload = getPayrollPayload();

    if (!validatePayroll(payload, true)) {
        return;
    }

    const payroll = await PayrollAuth.request(`/api/employee/${employeeId}/payroll`, {
        method: "POST",
        body: JSON.stringify(payload)
    });

    fillPayroll(payroll);
    setPayrollMessage("Payroll saved successfully.");
}

async function updatePayroll() {
    const id = document.getElementById("payrollId").value;
    const payload = getPayrollPayload();

    if (!id) {
        setPayrollMessage("Payroll ID is required for update.");
        return;
    }

    if (!validatePayroll(payload, false)) {
        return;
    }

    const payroll = await PayrollAuth.request(`/api/payroll/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });

    fillPayroll(payroll);
    setPayrollMessage("Payroll updated successfully.");
}

savePayrollButton.addEventListener("click", () => {
    savePayroll().catch((error) => setPayrollMessage(error.message));
});

updatePayrollButton.addEventListener("click", () => {
    updatePayroll().catch((error) => setPayrollMessage(error.message));
});

resetPayrollButton.addEventListener("click", () => {
    document.querySelectorAll("input, select").forEach((field) => {
        field.value = "";
        field.classList.remove("invalid");
    });
    setPayrollMessage("");
});
