import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you wish to proceed? This change can be reversed later.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  danger = false,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4 pt-2">
        <div className={`p-3 rounded-full ${danger ? 'bg-cherry-light text-cherry' : 'bg-champagne/70 text-champagne-gold'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h4 className="font-display text-lg font-bold text-espresso">{title}</h4>
          <p className="text-xs text-espresso-muted leading-relaxed max-w-sm">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full pt-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
