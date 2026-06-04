if (PayrollAuth.requireAuth()) {
    PayrollAuth.setupLogoutLinks();
}

const payslipMessage = document.getElementById("payslipMessage");
const generatePayslipButton = document.getElementById("generatePayslipButton");
const printPayslipButton = document.getElementById("printPayslipButton");
const payslipRequiredFields = ["employeeId", "month", "year"];

PayrollAuth.setupRequiredFieldReset(payslipRequiredFields);

function setPayslipMessage(message) {
    payslipMessage.textContent = message;
}

function setText(id, value) {
    document.getElementById(id).textContent = value === null || value === undefined || value === "" ? "-" : value;
}

function renderPayslip(payslip) {
    setText("payslipEmployeeId", payslip.employeeId);
    setText("payslipEmployeeName", payslip.employeeName);
    setText("payslipEmail", payslip.email);
    setText("payslipDepartment", payslip.department);
    setText("payslipDesignation", payslip.designation);
    setText("payslipEmployeeType", payslip.employeeType);
    setText("payslipBankName", payslip.bankName);
    setText("payslipAccountNumber", payslip.accountNumber);
    setText("payslipMonth", payslip.month);
    setText("payslipYear", payslip.year);
    setText("payslipBaseSalary", payslip.baseSalary);
    setText("payslipBonus", payslip.bonus);
    setText("payslipDeductions", payslip.deductions);
    setText("payslipTotalWorkingDays", payslip.totalWorkingDays);
    setText("payslipDaysPresent", payslip.daysPresent);
    setText("payslipNetSalary", payslip.netSalary);
}

async function generatePayslip() {
    const employeeId = document.getElementById("employeeId").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    if (!PayrollAuth.validateRequiredFields(payslipRequiredFields)) {
        setPayslipMessage("Employee ID, month, and year are required.");
        return;
    }

    setPayslipMessage("Loading payslip...");

    const payslip = await PayrollAuth.request(`/api/employee/${employeeId}/payslip/${month}/${year}`);
    renderPayslip(payslip);
    setPayslipMessage("Payslip loaded.");
}

generatePayslipButton.addEventListener("click", () => {
    generatePayslip().catch((error) => setPayslipMessage(error.message));
});

printPayslipButton.addEventListener("click", () => {
    window.print();
});
