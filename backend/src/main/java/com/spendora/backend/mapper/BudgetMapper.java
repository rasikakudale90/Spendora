package com.spendora.backend.mapper;

import com.spendora.backend.dto.request.CreateBudgetRequest;
import com.spendora.backend.dto.request.UpdateBudgetRequest;
import com.spendora.backend.dto.response.BudgetResponse;
import com.spendora.backend.entity.Budget;
import org.springframework.stereotype.Component;

@Component
public class BudgetMapper {

    public Budget toEntity(CreateBudgetRequest request) {
        if (request == null) return null;
        return Budget.builder()
                .name(request.getName())
                .category(request.getCategory())
                .periodStart(request.getPeriodStart())
                .periodEnd(request.getPeriodEnd())
                .limitAmount(request.getLimitAmount())
                .build();
    }

    public BudgetResponse toResponse(Budget budget) {
        if (budget == null) return null;
        return BudgetResponse.builder()
                .id(budget.getId())
                .name(budget.getName())
                .category(budget.getCategory())
                .periodStart(budget.getPeriodStart())
                .periodEnd(budget.getPeriodEnd())
                .limitAmount(budget.getLimitAmount())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }

    public void updateEntity(Budget budget, UpdateBudgetRequest request) {
        if (budget == null || request == null) return;
        budget.setName(request.getName());
        budget.setCategory(request.getCategory());
        budget.setPeriodStart(request.getPeriodStart());
        budget.setPeriodEnd(request.getPeriodEnd());
        budget.setLimitAmount(request.getLimitAmount());
    }
}
