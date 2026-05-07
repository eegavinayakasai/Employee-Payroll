package com.employee_payroll.Employee.controller;

import com.employee_payroll.Employee.model.Month;
import com.employee_payroll.Employee.model.Payroll;
import com.employee_payroll.Employee.model.Payslip;
import com.employee_payroll.Employee.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PayrollController
{
    private final PayrollService payrollService;

    @PostMapping("/employee/{employeeId}/payroll")
    public ResponseEntity<Payroll> addPayroll(@PathVariable Long employeeId, @RequestBody Payroll payroll)
    {
        Payroll savedPayroll = payrollService.addPayroll(employeeId, payroll);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayroll);
    }

    @GetMapping("/payrolls")
    public ResponseEntity<List<Payroll>> getAllPayrolls()
    {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @GetMapping("/payroll/{id}")
    public ResponseEntity<Payroll> getPayrollById(@PathVariable Long id)
    {
        return ResponseEntity.ok(payrollService.getPayrollById(id));
    }

    @GetMapping("/employee/{employeeId}/payrolls")
    public ResponseEntity<List<Payroll>> getPayrollsByEmployeeId(@PathVariable Long employeeId)
    {
        return ResponseEntity.ok(payrollService.getPayrollsByEmployeeId(employeeId));
    }

    @GetMapping("/employee/{employeeId}/payroll/{month}/{year}")
    public ResponseEntity<Payroll> getPayrollByEmployeeMonthAndYear(
            @PathVariable Long employeeId,
            @PathVariable Month month,
            @PathVariable int year)
    {
        return ResponseEntity.ok(payrollService.getPayrollByEmployeeMonthAndYear(employeeId, month, year));
    }

    @GetMapping("/employee/{employeeId}/payslips")
    public ResponseEntity<List<Payslip>> getPayslipsByEmployeeId(@PathVariable Long employeeId)
    {
        return ResponseEntity.ok(payrollService.getPayslipsByEmployeeId(employeeId));
    }

    @GetMapping("/employee/{employeeId}/payslip/{month}/{year}")
    public ResponseEntity<Payslip> getPayslip(
            @PathVariable Long employeeId,
            @PathVariable Month month,
            @PathVariable int year)
    {
        return ResponseEntity.ok(payrollService.getPayslip(employeeId, month, year));
    }

    @PutMapping("/payroll/{id}")
    public ResponseEntity<Payroll> updatePayroll(@PathVariable Long id, @RequestBody Payroll payroll)
    {
        return ResponseEntity.ok(payrollService.updatePayroll(id, payroll));
    }

    @PatchMapping("/payroll/{id}")
    public ResponseEntity<Payroll> partialUpdatePayroll(
            @PathVariable Long id,
            @RequestBody Payroll payrollDetails) {
        return ResponseEntity.ok(payrollService.partialUpdatePayroll(id, payrollDetails));
    }

    @DeleteMapping("/payroll/{id}")
    public ResponseEntity<Void> deletePayroll(@PathVariable Long id)
    {
        payrollService.deletePayroll(id);
        return ResponseEntity.noContent().build();
    }
}
