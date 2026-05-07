package com.employee_payroll.Employee.service;

import com.employee_payroll.Employee.exceptionHandler.ResourceNotFoundException;
import com.employee_payroll.Employee.model.Employee;
import com.employee_payroll.Employee.model.EmployeeType;
import com.employee_payroll.Employee.repository.EmployeeRepo;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepo employeeRepo;

    public Employee addEmployee(Employee employee) {
        if (employee.getBaseSalary() > 0) {
            if (employee.getBankName() == null || employee.getBankName().isBlank()) {
                throw new IllegalArgumentException("Bank name is required when salary is greater than zero");
            }
            if (employee.getAccountNumber() == null || employee.getAccountNumber().isBlank()) {
                throw new IllegalArgumentException("Account number is required when salary is greater than zero");
            }
        }
        return employeeRepo.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepo.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);

        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setDesignation(employeeDetails.getDesignation());
        employee.setEmployeeType(employeeDetails.getEmployeeType());
        employee.setBaseSalary(employeeDetails.getBaseSalary());
        employee.setBankName(employeeDetails.getBankName());
        employee.setAccountNumber(employeeDetails.getAccountNumber());

        return employeeRepo.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        employeeRepo.delete(employee);
    }

    public Employee partialUpdateEmployee(Long id, Employee employeeDetails) {
        Employee employee = getEmployeeById(id);

        if (employeeDetails.getName() != null)
            employee.setName(employeeDetails.getName());

        if (employeeDetails.getEmail() != null)
            employee.setEmail(employeeDetails.getEmail());

        if (employeeDetails.getDepartment() != null)
            employee.setDepartment(employeeDetails.getDepartment());

        if (employeeDetails.getDesignation() != null)
            employee.setDesignation(employeeDetails.getDesignation());

        if (employeeDetails.getEmployeeType() != null)
            employee.setEmployeeType(employeeDetails.getEmployeeType());

        if (employeeDetails.getBaseSalary() != null)
            employee.setBaseSalary(employeeDetails.getBaseSalary());

        if (employeeDetails.getBankName() != null)
            employee.setBankName(employeeDetails.getBankName());

        if (employeeDetails.getAccountNumber() != null)
            employee.setAccountNumber(employeeDetails.getAccountNumber());

        return employeeRepo.save(employee);
    }

    public List<Employee> searchEmployee(
            String name,
            String email,
            String department,
            String designation,
            EmployeeType employeeType,
            String bankName,
            String accountNumber,
            Double minBaseSalary,
            Double maxBaseSalary) {
        List<Employee> list = employeeRepo.findAll(((root, query, cb) ->
        {
            List<Predicate> predicates = new ArrayList<>();
            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (email != null && !email.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
            }
            if (department != null && !department.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("department")), "%" + department.toLowerCase() + "%"));
            }
            if (designation != null && !designation.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("designation")), "%" + designation.toLowerCase() + "%"));
            }
            if (employeeType != null) {
                predicates.add(cb.equal(root.get("employeeType"), employeeType));
            }
            if (bankName != null && !bankName.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("bankName")), "%" + bankName.toLowerCase() + "%"));
            }
            if (accountNumber != null && !accountNumber.isEmpty()) {
                predicates.add(cb.equal(root.get("accountNumber"), accountNumber));
            }
            if (minBaseSalary != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("baseSalary"), minBaseSalary));
            }
            if (maxBaseSalary != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("baseSalary"), maxBaseSalary));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        }));
        if (list.isEmpty()) {
            throw new ResourceNotFoundException("No employees found");
        }
        return list;
    }
}
