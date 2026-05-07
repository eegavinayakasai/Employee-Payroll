package com.employee_payroll.Employee.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"employee_id","month","year"}
    )
)
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many payroll records → one employee
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private Double baseSalary;
    private Double bonus;
    private Double deductions;

    @Column(nullable = false)
    @NotNull(message = "Total working days is required")
    private Integer totalWorkingDays;

    @Column(nullable = false)

    private Integer daysPresent;

    private Double netSalary;

    @Enumerated(EnumType.STRING)
    private Month month;
    private Integer year;
}
