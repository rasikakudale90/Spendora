package com.spendora.backend.service;

import com.spendora.backend.dto.response.AnalyticsResponse;
import com.spendora.backend.enums.ExpenseCategory;
import com.spendora.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final ExpenseRepository expenseRepository;

    public AnalyticsService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        BigDecimal totalSpending = expenseRepository.sumAmountBetweenDates(startDate, endDate);
        if (totalSpending == null) {
            totalSpending = BigDecimal.ZERO;
        }

        var expensesInRange = expenseRepository.findByExpenseDateBetween(startDate, endDate);
        long totalCount = expensesInRange.size();

        BigDecimal averageSpending = BigDecimal.ZERO;
        if (totalCount > 0) {
            averageSpending = totalSpending.divide(BigDecimal.valueOf(totalCount), 2, RoundingMode.HALF_UP);
        }

        BigDecimal highestExpense = expenseRepository.maxAmountBetweenDates(startDate, endDate);
        if (highestExpense == null) highestExpense = BigDecimal.ZERO;

        BigDecimal lowestExpense = expenseRepository.minAmountBetweenDates(startDate, endDate);
        if (lowestExpense == null) lowestExpense = BigDecimal.ZERO;

        // Category breakdown
        Map<ExpenseCategory, BigDecimal> categoryBreakdown = new EnumMap<>(ExpenseCategory.class);
        for (ExpenseCategory cat : ExpenseCategory.values()) {
            categoryBreakdown.put(cat, BigDecimal.ZERO);
        }

        List<Object[]> rawCategorySum = expenseRepository.sumAmountGroupedByCategory(startDate, endDate);
        for (Object[] row : rawCategorySum) {
            ExpenseCategory cat = (ExpenseCategory) row[0];
            BigDecimal sum = (BigDecimal) row[1];
            if (cat != null && sum != null) {
                categoryBreakdown.put(cat, sum);
            }
        }

        // Daily trend points
        List<Object[]> rawDailySum = expenseRepository.sumAmountGroupedByDate(startDate, endDate);
        List<AnalyticsResponse.DailySpendingPoint> dailyTrend = new ArrayList<>();
        for (Object[] row : rawDailySum) {
            dailyTrend.add(new AnalyticsResponse.DailySpendingPoint(
                    (LocalDate) row[0],
                    (BigDecimal) row[1]
            ));
        }

        return new AnalyticsResponse(
                totalSpending,
                totalCount,
                averageSpending,
                highestExpense,
                lowestExpense,
                categoryBreakdown,
                dailyTrend
        );
    }
}
