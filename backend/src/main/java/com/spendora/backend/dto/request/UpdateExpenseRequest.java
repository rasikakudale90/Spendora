package com.spendora.backend.dto.request;

import com.spendora.backend.enums.ExpenseCategory;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UpdateExpenseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Category is required")
    private ExpenseCategory category;

    @NotNull(message = "Expense date is required")
    private LocalDate expenseDate;

    private String description;

    public UpdateExpenseRequest() {
    }

    public UpdateExpenseRequest(String title, BigDecimal amount, ExpenseCategory category, LocalDate expenseDate, String description) {
        this.title = title;
        this.amount = amount;
        this.category = category;
        this.expenseDate = expenseDate;
        this.description = description;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String title;
        private BigDecimal amount;
        private ExpenseCategory category;
        private LocalDate expenseDate;
        private String description;

        public Builder title(String title) { this.title = title; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder category(ExpenseCategory category) { this.category = category; return this; }
        public Builder expenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; return this; }
        public Builder description(String description) { this.description = description; return this; }

        public UpdateExpenseRequest build() {
            return new UpdateExpenseRequest(title, amount, category, expenseDate, description);
        }
    }
}
