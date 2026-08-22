package com.spendora.backend.mapper;

import com.spendora.backend.dto.request.CreateExpenseRequest;
import com.spendora.backend.dto.request.UpdateExpenseRequest;
import com.spendora.backend.dto.response.ExpenseResponse;
import com.spendora.backend.entity.Expense;
import org.springframework.stereotype.Component;

@Component
public class ExpenseMapper {

    public Expense toEntity(CreateExpenseRequest request) {
        if (request == null) return null;
        return Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .expenseDate(request.getExpenseDate())
                .description(request.getDescription())
                .build();
    }

    public ExpenseResponse toResponse(Expense expense) {
        if (expense == null) return null;
        return ExpenseResponse.builder()
                .id(expense.getId())
                .title(expense.getTitle())
                .amount(expense.getAmount())
                .category(expense.getCategory())
                .expenseDate(expense.getExpenseDate())
                .description(expense.getDescription())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .build();
    }

    public void updateEntity(Expense expense, UpdateExpenseRequest request) {
        if (expense == null || request == null) return;
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());
    }
}
