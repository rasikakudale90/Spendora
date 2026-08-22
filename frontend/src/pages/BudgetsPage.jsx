import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { BudgetCard } from '../components/budget/BudgetCard';
import { BudgetForm } from '../components/budget/BudgetForm';
import { useBudgets } from '../hooks/useBudgets';
import { useApp } from '../context/AppContext';
import { Plus } from 'lucide-react';

export const BudgetsPage = () => {
  const { addToast } = useApp();
  const { budgetProgress, isLoading, createBudget, updateBudget, deleteBudget } = useBudgets();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async (data) => {
    setIsSaving(true);
    try {
      await createBudget(data);
      setShowCreateModal(false);
    } catch (err) {
      addToast(err.message || 'Failed to create budget', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setIsSaving(true);
    try {
      await updateBudget(editingBudget.budgetId, data);
      setEditingBudget(null);
    } catch (err) {
      addToast(err.message || 'Failed to update budget', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBudget(deletingId);
      setDeletingId(null);
    } catch (err) {
      addToast(err.message || 'Failed to delete budget', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-h1">Budgets</h1>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginTop: '4px' }}>
            Set limits and track your spending by period or category
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} /> New Budget
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ padding: '1.5rem', background: 'var(--card)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border)' }}>
              <SkeletonLoader height="20px" width="60%" style={{ marginBottom: '0.75rem' }} />
              <SkeletonLoader height="12px" width="45%" style={{ marginBottom: '1.25rem' }} />
              <SkeletonLoader height="8px" style={{ marginBottom: '1rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[0, 1, 2].map((j) => <SkeletonLoader key={j} height="50px" />)}
              </div>
            </div>
          ))}
        </div>
      ) : budgetProgress.length === 0 ? (
        <EmptyState
          title="No budgets yet"
          description="Create a budget to start tracking your spending limits."
          actionText="Create Budget"
          onAction={() => setShowCreateModal(true)}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {budgetProgress.map((budget) => (
            <BudgetCard
              key={budget.budgetId}
              budget={budget}
              onEdit={(b) => setEditingBudget(b)}
              onDelete={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="New Budget">
        <BudgetForm onSubmit={handleCreate} onCancel={() => setShowCreateModal(false)} isLoading={isSaving} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingBudget} onClose={() => setEditingBudget(null)} title="Edit Budget">
        <BudgetForm
          initialData={editingBudget ? { ...editingBudget, limitAmount: editingBudget.limitAmount } : null}
          onSubmit={handleUpdate}
          onCancel={() => setEditingBudget(null)}
          isLoading={isSaving}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deletingId} onClose={() => setDeletingId(null)} title="Delete Budget">
        <p className="text-body" style={{ marginBottom: '1.5rem', color: 'var(--muted-foreground)' }}>
          Are you sure you want to delete this budget? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete Budget</Button>
        </div>
      </Modal>
    </div>
  );
};
