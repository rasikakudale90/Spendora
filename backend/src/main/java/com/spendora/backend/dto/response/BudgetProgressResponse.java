package com.spendora.backend.dto.response;

import com.spendora.backend.enums.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class BudgetProgressResponse {
    private UUID budgetId;
    private String name;
    private ExpenseCategory category;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private double utilizationPercentage;
    private String status;

    public BudgetProgressResponse() {
    }

    public BudgetProgressResponse(UUID budgetId, String name, ExpenseCategory category, LocalDate periodStart, LocalDate periodEnd, BigDecimal limitAmount, BigDecimal spentAmount, BigDecimal remainingAmount, double utilizationPercentage, String status) {
        this.budgetId = budgetId;
        this.name = name;
        this.category = category;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.limitAmount = limitAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = remainingAmount;
        this.utilizationPercentage = utilizationPercentage;
        this.status = status;
    }

    public UUID getBudgetId() { return budgetId; }
    public void setBudgetId(UUID budgetId) { this.budgetId = budgetId; }

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

    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; }

    public double getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID budgetId;
        private String name;
        private ExpenseCategory category;
        private LocalDate periodStart;
        private LocalDate periodEnd;
        private BigDecimal limitAmount;
        private BigDecimal spentAmount;
        private BigDecimal remainingAmount;
        private double utilizationPercentage;
        private String status;

        public Builder budgetId(UUID budgetId) { this.budgetId = budgetId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(ExpenseCategory category) { this.category = category; return this; }
        public Builder periodStart(LocalDate periodStart) { this.periodStart = periodStart; return this; }
        public Builder periodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; return this; }
        public Builder limitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; return this; }
        public Builder spentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; return this; }
        public Builder remainingAmount(BigDecimal remainingAmount) { this.remainingAmount = remainingAmount; return this; }
        public Builder utilizationPercentage(double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; return this; }
        public Builder status(String status) { this.status = status; return this; }

        public BudgetProgressResponse build() {
            return new BudgetProgressResponse(budgetId, name, category, periodStart, periodEnd, limitAmount, spentAmount, remainingAmount, utilizationPercentage, status);
        }
    }
}
