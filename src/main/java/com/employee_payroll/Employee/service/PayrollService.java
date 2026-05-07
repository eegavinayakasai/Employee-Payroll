package com.employee_payroll.Employee.service;

import com.employee_payroll.Employee.exceptionHandler.DuplicateResourceException;
import com.employee_payroll.Employee.exceptionHandler.ResourceNotFoundException;
import com.employee_payroll.Employee.model.Employee;
import com.employee_payroll.Employee.model.Month;
import com.employee_payroll.Employee.model.Payroll;
import com.employee_payroll.Employee.model.Payslip;
import com.employee_payroll.Employee.repository.PayrollRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PayrollService
{
    private final PayrollRepo payrollRepo;
    private final EmployeeService employeeService;

    public Payroll addPayroll(Long employeeId, Payroll payroll) {
        Employee employee = employeeService.getEmployeeById(employeeId);

        if (payrollRepo.existsByEmployeeAndMonthAndYear(employee, payroll.getMonth(), payroll.getYear())) {
            throw new DuplicateResourceException("Payroll already exists for this employee, month, and year");
        }

        payroll.setEmployee(employee);
        if (payroll.getBaseSalary() == null || payroll.getBaseSalary() <= 0) {
            payroll.setBaseSalary(employee.getBaseSalary());
        }
        payroll.setNetSalary(calculateNetSalary(payroll));

        return payrollRepo.save(payroll);
    }

    public List<Payroll> getAllPayrolls() {
        return payrollRepo.findAll();
    }

    public Payroll getPayrollById(Long id) {
        return payrollRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found with id: " + id));
    }

    public List<Payroll> getPayrollsByEmployeeId(Long employeeId) {
        employeeService.getEmployeeById(employeeId);
        return payrollRepo.findByEmployeeId(employeeId);
    }

    public Payroll getPayrollByEmployeeMonthAndYear(Long employeeId, Month month, int year) {
        Employee employee = employeeService.getEmployeeById(employeeId);
        return payrollRepo.findByEmployeeAndMonthAndYear(employee, month, year)
                .orElseThrow(() -> new ResourceNotFoundException("Payroll not found for employee id: " + employeeId));
    }

    public List<Payslip> getPayslipsByEmployeeId(Long employeeId) {
        employeeService.getEmployeeById(employeeId);
        return payrollRepo.findByEmployeeId(employeeId)
                .stream()
                .map(this::buildPayslip)
                .toList();
    }

    public Payslip getPayslip(Long employeeId, Month month, int year) {
        Payroll payroll = getPayrollByEmployeeMonthAndYear(employeeId, month, year);
        return buildPayslip(payroll);
    }

    public Payroll updatePayroll(Long id, Payroll payrollDetails) {
        Payroll payroll = getPayrollById(id);

        payroll.setBaseSalary(payrollDetails.getBaseSalary());
        payroll.setBonus(payrollDetails.getBonus());
        payroll.setDeductions(payrollDetails.getDeductions());
        payroll.setTotalWorkingDays(payrollDetails.getTotalWorkingDays());
        payroll.setDaysPresent(payrollDetails.getDaysPresent());
        payroll.setMonth(payrollDetails.getMonth());
        payroll.setYear(payrollDetails.getYear());
        payroll.setNetSalary(calculateNetSalary(payroll));

        return payrollRepo.save(payroll);
    }

    public Payroll partialUpdatePayroll(Long id, Payroll payrollDetails) {
        Payroll payroll = getPayrollById(id);

        if (payrollDetails.getBaseSalary() != null)
            payroll.setBaseSalary(payrollDetails.getBaseSalary());
        if (payrollDetails.getBonus() != null)
            payroll.setBonus(payrollDetails.getBonus());
        if (payrollDetails.getDeductions() != null)
            payroll.setDeductions(payrollDetails.getDeductions());
        if (payrollDetails.getTotalWorkingDays() != null)
            payroll.setTotalWorkingDays(payrollDetails.getTotalWorkingDays());
        if (payrollDetails.getDaysPresent() != null)
            payroll.setDaysPresent(payrollDetails.getDaysPresent());
        if (payrollDetails.getMonth() != null)
            payroll.setMonth(payrollDetails.getMonth());
        if (payrollDetails.getYear() != null)
            payroll.setYear(payrollDetails.getYear());

        payroll.setNetSalary(calculateNetSalary(payroll)); // recalculate
        return payrollRepo.save(payroll);
    }

    public void deletePayroll(Long id) {
        Payroll payroll = getPayrollById(id);
        payrollRepo.delete(payroll);
    }

    private double calculateNetSalary(Payroll payroll) {
        if (payroll.getTotalWorkingDays() <= 0) {
            throw new IllegalArgumentException("Total working days must be greater than zero");
        }
        if (payroll.getDaysPresent() < 0 || payroll.getDaysPresent() > payroll.getTotalWorkingDays()) {
            throw new IllegalArgumentException("Days present must be between zero and total working days");
        }

        double earnedSalary = (payroll.getBaseSalary() / payroll.getTotalWorkingDays()) * payroll.getDaysPresent();
        return earnedSalary + payroll.getBonus() - payroll.getDeductions();
    }

    private Payslip buildPayslip(Payroll payroll) {
        Employee employee = payroll.getEmployee();

        return Payslip.builder()
                .employeeId(employee.getId())
                .employeeName(employee.getName())
                .email(employee.getEmail())
                .department(employee.getDepartment())
                .designation(employee.getDesignation())
                .employeeType(employee.getEmployeeType())
                .bankName(employee.getBankName())
                .accountNumber(employee.getAccountNumber())
                .month(payroll.getMonth())
                .year(payroll.getYear())
                .baseSalary(payroll.getBaseSalary())
                .bonus(payroll.getBonus())
                .deductions(payroll.getDeductions())
                .totalWorkingDays(payroll.getTotalWorkingDays())
                .daysPresent(payroll.getDaysPresent())
                .netSalary(payroll.getNetSalary())
                .build();
    }

}
