export const EXPENSE_CATEGORIES = [
  { value: 'FOOD', label: 'Food & Dining', color: 'var(--cat-2)' },
  { value: 'TRANSPORT', label: 'Transport & Travel', color: 'var(--cat-1)' },
  { value: 'SHOPPING', label: 'Shopping & Retail', color: 'var(--cat-3)' },
  { value: 'BILLS', label: 'Bills & Utilities', color: 'var(--cat-4)' },
  { value: 'HEALTH', label: 'Health & Medical', color: 'var(--cat-5)' },
  { value: 'ENTERTAINMENT', label: 'Entertainment', color: 'var(--cat-4)' },
  { value: 'OTHER', label: 'Other Expenses', color: 'var(--cat-6)' },
];

export const getCategoryMeta = (category) => {
  return (
    EXPENSE_CATEGORIES.find((c) => c.value === category) || {
      value: category,
      label: category,
      color: 'var(--cat-6)',
    }
  );
};
