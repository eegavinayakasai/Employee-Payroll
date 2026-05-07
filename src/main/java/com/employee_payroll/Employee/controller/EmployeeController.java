package com.employee_payroll.Employee.controller;


import com.employee_payroll.Employee.model.Employee;
import com.employee_payroll.Employee.model.EmployeeType;
import com.employee_payroll.Employee.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class EmployeeController
{
    private  final EmployeeService employeeService;

    @PostMapping("/employee")
    public ResponseEntity<Employee> addEmployee(@Valid  @RequestBody Employee employee)
    {
        Employee emp = employeeService.addEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(emp);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees()
    {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id)
    {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PatchMapping("/employee/{id}")
    public ResponseEntity<Employee> partialUpdateEmployee(@PathVariable Long id, @RequestBody Employee employee)
    {
        return ResponseEntity.ok(employeeService.partialUpdateEmployee(id, employee));
    }

    @PutMapping("/employee/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @Valid @RequestBody Employee employee)
    {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employee));
    }

    @DeleteMapping("/employee/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id)
    {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/employees/search")
    public ResponseEntity<List<Employee>> searchEmployees(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String designation,
            @RequestParam(required = false) EmployeeType employeeType,
            @RequestParam(required = false) String bankName,
            @RequestParam(required = false) String accountNumber,
            @RequestParam(required = false) Double minBaseSalary,
            @RequestParam(required = false) Double maxBaseSalary)
    {
        return ResponseEntity.ok(employeeService.searchEmployee(
                name, email, department, designation,
                employeeType, bankName, accountNumber,
                minBaseSalary, maxBaseSalary));
    }
}
