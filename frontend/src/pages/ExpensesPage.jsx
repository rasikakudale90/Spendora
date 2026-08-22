import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { ExpenseTable } from '../components/expense/ExpenseTable';
import { ExpenseFilters } from '../components/expense/ExpenseFilters';
import { ExpenseSummaryCards } from '../components/expense/ExpenseSummaryCards';
import { ExpenseForm } from '../components/expense/ExpenseForm';
import { useExpenses } from '../hooks/useExpenses';
import { useApp } from '../context/AppContext';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export const ExpensesPage = () => {
  const { addToast } = useApp();
  const { expenses, pagination, isLoading, filters, updateFilters, clearFilters, goToPage, createExpense, updateExpense, deleteExpense } = useExpenses();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const handleCreate = async (data) => {
    setIsSaving(true);
    try {
      await createExpense(data);
      setShowCreateModal(false);
    } catch (err) {
      addToast(err.message || 'Failed to create expense', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await updateExpense(editingExpense.id, data);
      setEditingExpense(null);
    } catch (err) {
      addToast(err.message || 'Failed to update expense', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExpense(deletingId);
      setDeletingId(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete expense', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-h1">Expenses</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginTop: '4px' }}>
            {pagination.totalElements} total records
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      {/* Summary */}
      <ExpenseSummaryCards
        totalAmount={expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0)}
        totalCount={pagination.totalElements}
        isLoading={isLoading}
      />

      {/* Filters */}
      <ExpenseFilters filters={filters} onChange={updateFilters} onClear={clearFilters} />

      {/* Table */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[0, 1, 2, 3, 4].map((i) => <SkeletonLoader key={i} height="52px" borderRadius="var(--radius-md)" />)}
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          description="Try adjusting your filters or add a new expense."
          actionText="Add Expense"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <ExpenseTable
          expenses={expenses}
          onEdit={(exp) => setEditingExpense(exp)}
          onDelete={(id) => setDeletingId(id)}
        />
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pagination.page - 1)}
            disabled={pagination.page === 0}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-mono-amount" style={{ color: 'var(--muted-foreground)' }}>
            Page {pagination.page + 1} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(pagination.page + 1)}
            disabled={pagination.last}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Add New Expense">
        <ExpenseForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} isLoading={isSaving} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingExpense} onClose={() => setEditingExpense(null)} title="Edit Expense">
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleUpdate}
          onCancel={() => setEditingExpense(null)}
          isLoading={isSaving}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Expense">
        <p className="text-body" style={{ marginBottom: '1.5rem', color: 'var(--muted-foreground)' }}>
          Are you sure you want to delete this expense? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete Expense</Button>
        </div>
      </Modal>
    </div>
  );
};
