package com.spendora.backend.dto.request;

import com.spendora.backend.enums.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateBudgetRequest {

    @NotBlank(message = "Budget name is required")
    private String name;

    private ExpenseCategory category;

    @NotNull(message = "Period start date is required")
    private LocalDate periodStart;

    @NotNull(message = "Period end date is required")
    private LocalDate periodEnd;

    @NotNull(message = "Limit amount is required")
    @DecimalMin(value = "0.01", message = "Limit amount must be greater than zero")
    private BigDecimal limitAmount;

    public CreateBudgetRequest() {
    }

    public CreateBudgetRequest(String name, ExpenseCategory category, LocalDate periodStart, LocalDate periodEnd, BigDecimal limitAmount) {
        this.name = name;
        this.category = category;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.limitAmount = limitAmount;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }

    public LocalDate getPeriodStart() { return periodStart; }
    public void setPeriodStart(LocalDate periodStart) { this.periodStart = periodStart; }

    public LocalDate getPeriodEnd() { return periodEnd; }
    public void setPeriodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; }

    public BigDecimal getLimitAmount() { return limitAmount; }
    public void setLimitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String name;
        private ExpenseCategory category;
        private LocalDate periodStart;
        private LocalDate periodEnd;
        private BigDecimal limitAmount;

        public Builder name(String name) { this.name = name; return this; }
        public Builder category(ExpenseCategory category) { this.category = category; return this; }
        public Builder periodStart(LocalDate periodStart) { this.periodStart = periodStart; return this; }
        public Builder periodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; return this; }
        public Builder limitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; return this; }

        public CreateBudgetRequest build() {
            return new CreateBudgetRequest(name, category, periodStart, periodEnd, limitAmount);
        }
    }
}
