package com.spendora.backend.controller;

import com.spendora.backend.dto.request.CreateExpenseRequest;
import com.spendora.backend.dto.request.UpdateExpenseRequest;
import com.spendora.backend.dto.response.ExpenseResponse;
import com.spendora.backend.dto.response.PagedResponse;
import com.spendora.backend.enums.ExpenseCategory;
import com.spendora.backend.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
@Tag(name = "Expenses", description = "Endpoints for managing personal expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    @Operation(summary = "Create a new expense")
    public ResponseEntity<ExpenseResponse> createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get expense by ID")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable UUID id) {
        ExpenseResponse response = expenseService.getExpenseById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Search, filter, sort, and paginate expenses")
    public ResponseEntity<PagedResponse<ExpenseResponse>> getExpenses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) BigDecimal minAmount,
            @RequestParam(required = false) BigDecimal maxAmount,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        PagedResponse<ExpenseResponse> response = expenseService.getExpenses(
                search, category, startDate, endDate, minAmount, maxAmount, page, size, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing expense")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateExpenseRequest request) {
        ExpenseResponse response = expenseService.updateExpense(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an expense")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
