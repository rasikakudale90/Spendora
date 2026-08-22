package com.spendora.backend.repository;

import com.spendora.backend.entity.Expense;
import com.spendora.backend.enums.ExpenseCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID>, JpaSpecificationExecutor<Expense> {

    List<Expense> findByExpenseDateBetween(LocalDate startDate, LocalDate endDate);

    List<Expense> findByCategoryAndExpenseDateBetween(ExpenseCategory category, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.category = :category AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByCategoryAndDates(@Param("category") ExpenseCategory category,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate GROUP BY e.category")
    List<Object[]> sumAmountGroupedByCategory(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.expenseDate, SUM(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate GROUP BY e.expenseDate ORDER BY e.expenseDate ASC")
    List<Object[]> sumAmountGroupedByDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT MAX(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal maxAmountBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT MIN(e.amount) FROM Expense e WHERE e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal minAmountBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
