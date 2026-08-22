package com.spendora.backend.dto.response;

import com.spendora.backend.enums.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AnalyticsResponse {
    private BigDecimal totalSpending;
    private long totalExpensesCount;
    private BigDecimal averageSpending;
    private BigDecimal highestExpense;
    private BigDecimal lowestExpense;
    private Map<ExpenseCategory, BigDecimal> categoryBreakdown;
    private List<DailySpendingPoint> dailyTrend;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(BigDecimal totalSpending, long totalExpensesCount, BigDecimal averageSpending, BigDecimal highestExpense, BigDecimal lowestExpense, Map<ExpenseCategory, BigDecimal> categoryBreakdown, List<DailySpendingPoint> dailyTrend) {
        this.totalSpending = totalSpending;
        this.totalExpensesCount = totalExpensesCount;
        this.averageSpending = averageSpending;
        this.highestExpense = highestExpense;
        this.lowestExpense = lowestExpense;
        this.categoryBreakdown = categoryBreakdown;
        this.dailyTrend = dailyTrend;
    }

    public BigDecimal getTotalSpending() { return totalSpending; }
    public void setTotalSpending(BigDecimal totalSpending) { this.totalSpending = totalSpending; }

    public long getTotalExpensesCount() { return totalExpensesCount; }
    public void setTotalExpensesCount(long totalExpensesCount) { this.totalExpensesCount = totalExpensesCount; }

    public BigDecimal getAverageSpending() { return averageSpending; }
    public void setAverageSpending(BigDecimal averageSpending) { this.averageSpending = averageSpending; }

    public BigDecimal getHighestExpense() { return highestExpense; }
    public void setHighestExpense(BigDecimal highestExpense) { this.highestExpense = highestExpense; }

    public BigDecimal getLowestExpense() { return lowestExpense; }
    public void setLowestExpense(BigDecimal lowestExpense) { this.lowestExpense = lowestExpense; }

    public Map<ExpenseCategory, BigDecimal> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(Map<ExpenseCategory, BigDecimal> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<DailySpendingPoint> getDailyTrend() { return dailyTrend; }
    public void setDailyTrend(List<DailySpendingPoint> dailyTrend) { this.dailyTrend = dailyTrend; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private BigDecimal totalSpending;
        private long totalExpensesCount;
        private BigDecimal averageSpending;
        private BigDecimal highestExpense;
        private BigDecimal lowestExpense;
        private Map<ExpenseCategory, BigDecimal> categoryBreakdown;
        private List<DailySpendingPoint> dailyTrend;

        public Builder totalSpending(BigDecimal totalSpending) { this.totalSpending = totalSpending; return this; }
        public Builder totalExpensesCount(long totalExpensesCount) { this.totalExpensesCount = totalExpensesCount; return this; }
        public Builder averageSpending(BigDecimal averageSpending) { this.averageSpending = averageSpending; return this; }
        public Builder highestExpense(BigDecimal highestExpense) { this.highestExpense = highestExpense; return this; }
        public Builder lowestExpense(BigDecimal lowestExpense) { this.lowestExpense = lowestExpense; return this; }
        public Builder categoryBreakdown(Map<ExpenseCategory, BigDecimal> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; return this; }
        public Builder dailyTrend(List<DailySpendingPoint> dailyTrend) { this.dailyTrend = dailyTrend; return this; }

        public AnalyticsResponse build() {
            return new AnalyticsResponse(totalSpending, totalExpensesCount, averageSpending, highestExpense, lowestExpense, categoryBreakdown, dailyTrend);
        }
    }

    public static class DailySpendingPoint {
        private LocalDate date;
        private BigDecimal amount;

        public DailySpendingPoint() {
        }

        public DailySpendingPoint(LocalDate date, BigDecimal amount) {
            this.date = date;
            this.amount = amount;
        }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private LocalDate date;
            private BigDecimal amount;

            public Builder date(LocalDate date) { this.date = date; return this; }
            public Builder amount(BigDecimal amount) { this.amount = amount; return this; }

            public DailySpendingPoint build() {
                return new DailySpendingPoint(date, amount);
            }
        }
    }
}
