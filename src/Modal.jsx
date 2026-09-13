export default function Modal({ isOpen, onClose, onConfirm, value, onChange }) {
  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onConfirm();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add new column</h3>
        <input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          onKeyDown={handleKeyDown}
          placeholder="Column title..." 
          autoFocus
        />
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onConfirm} className="btn-primary">Add</button>
        </div>
      </div>
    </div>
  );
}