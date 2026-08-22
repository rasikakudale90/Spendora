package com.spendora.backend.repository;

import com.spendora.backend.entity.Budget;
import com.spendora.backend.enums.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByCategory(ExpenseCategory category);
}
