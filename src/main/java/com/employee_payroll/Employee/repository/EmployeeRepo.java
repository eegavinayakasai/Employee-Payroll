package com.employee_payroll.Employee.repository;

import com.employee_payroll.Employee.model.Employee;
import com.employee_payroll.Employee.model.EmployeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface EmployeeRepo extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee>
{

}
