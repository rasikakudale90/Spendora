package com.spendora.backend.dto.response;

import com.spendora.backend.enums.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class BudgetResponse {
    private UUID id;
    private String name;
    private ExpenseCategory category;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private BigDecimal limitAmount;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public BudgetResponse() {
    }

    public BudgetResponse(UUID id, String name, ExpenseCategory category, LocalDate periodStart, LocalDate periodEnd, BigDecimal limitAmount, OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.periodStart = periodStart;
        this.periodEnd = periodEnd;
        this.limitAmount = limitAmount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private UUID id;
        private String name;
        private ExpenseCategory category;
        private LocalDate periodStart;
        private LocalDate periodEnd;
        private BigDecimal limitAmount;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;

        public Builder id(UUID id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder category(ExpenseCategory category) { this.category = category; return this; }
        public Builder periodStart(LocalDate periodStart) { this.periodStart = periodStart; return this; }
        public Builder periodEnd(LocalDate periodEnd) { this.periodEnd = periodEnd; return this; }
        public Builder limitAmount(BigDecimal limitAmount) { this.limitAmount = limitAmount; return this; }
        public Builder createdAt(OffsetDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public BudgetResponse build() {
            return new BudgetResponse(id, name, category, periodStart, periodEnd, limitAmount, createdAt, updatedAt);
        }
    }
}
