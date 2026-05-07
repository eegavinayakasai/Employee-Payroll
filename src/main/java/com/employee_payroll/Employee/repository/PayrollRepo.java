package com.employee_payroll.Employee.repository;

import com.employee_payroll.Employee.model.Employee;
import com.employee_payroll.Employee.model.Month;
import com.employee_payroll.Employee.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PayrollRepo extends JpaRepository<Payroll, Long>
{
    List<Payroll> findByEmployeeId(Long employeeId);

    Optional<Payroll> findByEmployeeAndMonthAndYear(Employee employee, Month month, int year);

    boolean existsByEmployeeAndMonthAndYear(Employee employee, Month month, int year);
}
