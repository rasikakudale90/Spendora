package com.spendora.backend.service;

import com.spendora.backend.dto.request.CreateExpenseRequest;
import com.spendora.backend.dto.request.UpdateExpenseRequest;
import com.spendora.backend.dto.response.ExpenseResponse;
import com.spendora.backend.dto.response.PagedResponse;
import com.spendora.backend.entity.Expense;
import com.spendora.backend.enums.ExpenseCategory;
import com.spendora.backend.exception.ResourceNotFoundException;
import com.spendora.backend.mapper.ExpenseMapper;
import com.spendora.backend.repository.ExpenseRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseService(ExpenseRepository expenseRepository, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.expenseMapper = expenseMapper;
    }

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request) {
        Expense expense = expenseMapper.toEntity(request);
        Expense savedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(savedExpense);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(UUID id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return expenseMapper.toResponse(expense);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ExpenseResponse> getExpenses(
            String search,
            ExpenseCategory category,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal minAmount,
            BigDecimal maxAmount,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Expense> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleMatch, descMatch));
            }

            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }

            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("expenseDate"), startDate));
            }

            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("expenseDate"), endDate));
            }

            if (minAmount != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), minAmount));
            }

            if (maxAmount != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), maxAmount));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Expense> expensePage = expenseRepository.findAll(spec, pageable);

        List<ExpenseResponse> content = expensePage.getContent().stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ExpenseResponse>builder()
                .content(content)
                .page(expensePage.getNumber())
                .size(expensePage.getSize())
                .totalElements(expensePage.getTotalElements())
                .totalPages(expensePage.getTotalPages())
                .last(expensePage.isLast())
                .build();
    }

    @Transactional
    public ExpenseResponse updateExpense(UUID id, UpdateExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        expenseMapper.updateEntity(expense, request);
        Expense updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(updatedExpense);
    }

    @Transactional
    public void deleteExpense(UUID id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with ID: " + id);
        }
        expenseRepository.deleteById(id);
    }
}
