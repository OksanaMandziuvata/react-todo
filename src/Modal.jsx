export default function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Add new column", 
  value = "", 
  onChange, 
  mode = "input", 
  message = "", 
  confirmText = "Add", 
  isValid = true, 
  errorMessage = "Invalid input",
  children
}) {
  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) onConfirm();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && <h3>{title}</h3>}
        {children}
       
        {mode === "input" && (
          <>
            <input 
              value={value} 
              onChange={(e) => onChange(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Column title..." 
              autoFocus
            />
            {!isValid && value.length > 0 && (
              <div className="error-text">{errorMessage}</div>
            )}
          </>
        )}

        {mode === "confirm" && (
          <p className="modal-message">{message}</p>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button 
            onClick={onConfirm} 
            className="btn-primary"
            disabled={!isValid}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}