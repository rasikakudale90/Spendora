package com.spendora.backend.controller;

import com.spendora.backend.dto.request.CreateBudgetRequest;
import com.spendora.backend.dto.request.UpdateBudgetRequest;
import com.spendora.backend.dto.response.BudgetProgressResponse;
import com.spendora.backend.dto.response.BudgetResponse;
import com.spendora.backend.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/budgets")
@Tag(name = "Budgets", description = "Endpoints for managing spending budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    @Operation(summary = "Create a new budget")
    public ResponseEntity<BudgetResponse> createBudget(@Valid @RequestBody CreateBudgetRequest request) {
        BudgetResponse response = budgetService.createBudget(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get budget by ID")
    public ResponseEntity<BudgetResponse> getBudgetById(@PathVariable UUID id) {
        BudgetResponse response = budgetService.getBudgetById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all budgets")
    public ResponseEntity<List<BudgetResponse>> getAllBudgets() {
        List<BudgetResponse> response = budgetService.getAllBudgets();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/progress")
    @Operation(summary = "Get progress and utilization for all budgets")
    public ResponseEntity<List<BudgetProgressResponse>> getBudgetProgressList() {
        List<BudgetProgressResponse> response = budgetService.getBudgetProgressList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/progress")
    @Operation(summary = "Get progress and utilization for a specific budget")
    public ResponseEntity<BudgetProgressResponse> getBudgetProgressById(@PathVariable UUID id) {
        BudgetProgressResponse response = budgetService.getBudgetProgressById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing budget")
    public ResponseEntity<BudgetResponse> updateBudget(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateBudgetRequest request) {
        BudgetResponse response = budgetService.updateBudget(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a budget")
    public ResponseEntity<Void> deleteBudget(@PathVariable UUID id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
