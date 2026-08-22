package com.spendora.backend.service;

import com.spendora.backend.dto.request.CreateExpenseRequest;
import com.spendora.backend.dto.response.ExpenseResponse;
import com.spendora.backend.entity.Expense;
import com.spendora.backend.enums.ExpenseCategory;
import com.spendora.backend.exception.ResourceNotFoundException;
import com.spendora.backend.mapper.ExpenseMapper;
import com.spendora.backend.repository.ExpenseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    private ExpenseMapper expenseMapper;
    private ExpenseService expenseService;

    private Expense expense;
    private CreateExpenseRequest createRequest;
    private UUID sampleId;

    @BeforeEach
    void setUp() {
        sampleId = UUID.randomUUID();
        expenseMapper = new ExpenseMapper();
        expenseService = new ExpenseService(expenseRepository, expenseMapper);

        createRequest = CreateExpenseRequest.builder()
                .title("Grocery Shopping")
                .amount(new BigDecimal("1500.00"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(LocalDate.now())
                .description("Supermarket groceries")
                .build();

        expense = Expense.builder()
                .id(sampleId)
                .title("Grocery Shopping")
                .amount(new BigDecimal("1500.00"))
                .category(ExpenseCategory.FOOD)
                .expenseDate(LocalDate.now())
                .description("Supermarket groceries")
                .build();
    }

    @Test
    void createExpense_Success() {
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);

        ExpenseResponse result = expenseService.createExpense(createRequest);

        assertNotNull(result);
        assertEquals(sampleId, result.getId());
        assertEquals("Grocery Shopping", result.getTitle());
        verify(expenseRepository, times(1)).save(any(Expense.class));
    }

    @Test
    void getExpenseById_Success() {
        when(expenseRepository.findById(sampleId)).thenReturn(Optional.of(expense));

        ExpenseResponse result = expenseService.getExpenseById(sampleId);

        assertNotNull(result);
        assertEquals(sampleId, result.getId());
    }

    @Test
    void getExpenseById_NotFound_ThrowsException() {
        when(expenseRepository.findById(sampleId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> expenseService.getExpenseById(sampleId));
    }
}
