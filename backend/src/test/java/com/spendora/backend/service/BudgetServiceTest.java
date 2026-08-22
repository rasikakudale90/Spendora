package com.spendora.backend.service;

import com.spendora.backend.dto.request.CreateBudgetRequest;
import com.spendora.backend.dto.response.BudgetResponse;
import com.spendora.backend.entity.Budget;
import com.spendora.backend.enums.ExpenseCategory;
import com.spendora.backend.exception.InvalidRequestException;
import com.spendora.backend.mapper.BudgetMapper;
import com.spendora.backend.repository.BudgetRepository;
import com.spendora.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    private BudgetMapper budgetMapper;
    private BudgetService budgetService;

    private Budget budget;
    private CreateBudgetRequest createRequest;
    private UUID sampleId;

    @BeforeEach
    void setUp() {
        sampleId = UUID.randomUUID();
        budgetMapper = new BudgetMapper();
        budgetService = new BudgetService(budgetRepository, expenseRepository, budgetMapper);

        createRequest = CreateBudgetRequest.builder()
                .name("Monthly Food Budget")
                .category(ExpenseCategory.FOOD)
                .periodStart(LocalDate.now().withDayOfMonth(1))
                .periodEnd(LocalDate.now().withDayOfMonth(28))
                .limitAmount(new BigDecimal("10000.00"))
                .build();

        budget = Budget.builder()
                .id(sampleId)
                .name("Monthly Food Budget")
                .category(ExpenseCategory.FOOD)
                .periodStart(LocalDate.now().withDayOfMonth(1))
                .periodEnd(LocalDate.now().withDayOfMonth(28))
                .limitAmount(new BigDecimal("10000.00"))
                .build();
    }

    @Test
    void createBudget_Success() {
        when(budgetRepository.save(any(Budget.class))).thenReturn(budget);

        BudgetResponse result = budgetService.createBudget(createRequest);

        assertNotNull(result);
        assertEquals(sampleId, result.getId());
        assertEquals("Monthly Food Budget", result.getName());
    }

    @Test
    void createBudget_InvalidDates_ThrowsException() {
        createRequest.setPeriodEnd(createRequest.getPeriodStart().minusDays(1));

        assertThrows(InvalidRequestException.class, () -> budgetService.createBudget(createRequest));
    }
}
