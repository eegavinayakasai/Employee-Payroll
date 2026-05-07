package com.employee_payroll.Employee.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payslip {

    private Long employeeId;
    private String employeeName;
    private String email;
    private String department;
    private String designation;
    private EmployeeType employeeType;
    private String bankName;
    private String accountNumber;

    private Month month;
    private Integer year;
    private Double baseSalary;
    private Double bonus;
    private Double deductions;
    private Integer totalWorkingDays;
    private Integer daysPresent;
    private Double netSalary;
}
