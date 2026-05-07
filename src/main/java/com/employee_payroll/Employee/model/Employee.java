package com.employee_payroll.Employee.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonManagedReference
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private List<Payroll> payrolls;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid and unique")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "Department is required")
    @Column(nullable = false)
    private String department;

    private String designation;

    @NotNull(message = "Employee Type is required")
    @Enumerated(EnumType.STRING)
    private EmployeeType employeeType;

    @NotNull(message = "Base Salary is required")
    @PositiveOrZero(message = "Base salary must be greater than or equal to zero")
    @Column(nullable = false)
    private Double baseSalary;

    private String bankName;
    private String accountNumber;
}
