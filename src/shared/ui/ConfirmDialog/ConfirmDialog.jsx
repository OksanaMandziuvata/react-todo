import { useEffect } from 'react';
import Button from '@/shared/ui/Button';
import Modal from '@/shared/ui/Modal';
import './ConfirmDialog.scss';

export default function ConfirmDialog({
  isOpen,
  title = 'Confirm Deletion',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-dialog"
      onClick={(event) => {
        if (event.target.classList.contains('modal-overlay')) onCancel();
      }}
    >
      <Modal
        title={title}
        footer={
          <>
            <Button variant="secondary" onClick={onCancel}>{cancelText}</Button>
            <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
          </>
        }
      >
        <p className="confirm-dialog-message">{message}</p>
      </Modal>
    </div>
  );
}
