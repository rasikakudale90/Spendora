package com.spendora.backend.service;

import com.spendora.backend.dto.request.CreateBudgetRequest;
import com.spendora.backend.dto.request.UpdateBudgetRequest;
import com.spendora.backend.dto.response.BudgetProgressResponse;
import com.spendora.backend.dto.response.BudgetResponse;
import com.spendora.backend.entity.Budget;
import com.spendora.backend.exception.InvalidRequestException;
import com.spendora.backend.exception.ResourceNotFoundException;
import com.spendora.backend.mapper.BudgetMapper;
import com.spendora.backend.repository.BudgetRepository;
import com.spendora.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetMapper budgetMapper;

    public BudgetService(BudgetRepository budgetRepository, ExpenseRepository expenseRepository, BudgetMapper budgetMapper) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
        this.budgetMapper = budgetMapper;
    }

    @Transactional
    public BudgetResponse createBudget(CreateBudgetRequest request) {
        if (request.getPeriodEnd().isBefore(request.getPeriodStart())) {
            throw new InvalidRequestException("Period end date cannot be before period start date");
        }
        Budget budget = budgetMapper.toEntity(request);
        Budget savedBudget = budgetRepository.save(budget);
        return budgetMapper.toResponse(savedBudget);
    }

    @Transactional(readOnly = true)
    public BudgetResponse getBudgetById(UUID id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        return budgetMapper.toResponse(budget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getAllBudgets() {
        return budgetRepository.findAll().stream()
                .map(budgetMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BudgetProgressResponse> getBudgetProgressList() {
        return budgetRepository.findAll().stream()
                .map(this::calculateProgress)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetProgressResponse getBudgetProgressById(UUID id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        return calculateProgress(budget);
    }

    @Transactional
    public BudgetResponse updateBudget(UUID id, UpdateBudgetRequest request) {
        if (request.getPeriodEnd().isBefore(request.getPeriodStart())) {
            throw new InvalidRequestException("Period end date cannot be before period start date");
        }
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        budgetMapper.updateEntity(budget, request);
        return budgetMapper.toResponse(budgetRepository.save(budget));
    }

    @Transactional
    public void deleteBudget(UUID id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Budget not found with ID: " + id);
        }
        budgetRepository.deleteById(id);
    }

    private BudgetProgressResponse calculateProgress(Budget budget) {
        BigDecimal spentAmount;
        if (budget.getCategory() == null) {
            spentAmount = expenseRepository.sumAmountBetweenDates(
                    budget.getPeriodStart(), budget.getPeriodEnd());
        } else {
            spentAmount = expenseRepository.sumAmountByCategoryAndDates(
                    budget.getCategory(), budget.getPeriodStart(), budget.getPeriodEnd());
        }
        if (spentAmount == null) spentAmount = BigDecimal.ZERO;

        BigDecimal remainingAmount = budget.getLimitAmount().subtract(spentAmount);

        double utilizationPercentage = 0.0;
        if (budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0) {
            utilizationPercentage = spentAmount
                    .multiply(BigDecimal.valueOf(100))
                    .divide(budget.getLimitAmount(), 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        String status = utilizationPercentage >= 100.0 ? "EXCEEDED"
                : utilizationPercentage >= 80.0 ? "WARNING"
                : "NORMAL";

        BudgetProgressResponse resp = new BudgetProgressResponse();
        resp.setBudgetId(budget.getId());
        resp.setName(budget.getName());
        resp.setCategory(budget.getCategory());
        resp.setPeriodStart(budget.getPeriodStart());
        resp.setPeriodEnd(budget.getPeriodEnd());
        resp.setLimitAmount(budget.getLimitAmount());
        resp.setSpentAmount(spentAmount);
        resp.setRemainingAmount(remainingAmount);
        resp.setUtilizationPercentage(utilizationPercentage);
        resp.setStatus(status);
        return resp;
    }
}
