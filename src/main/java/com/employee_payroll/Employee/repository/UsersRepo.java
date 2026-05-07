package com.employee_payroll.Employee.repository;

import com.employee_payroll.Employee.model.Employee;
import com.employee_payroll.Employee.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Long>
{
    Optional<User> findByUsername(String username);
}
