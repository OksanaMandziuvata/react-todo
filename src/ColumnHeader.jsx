import { useState } from 'react';
import DragIcon from './assets/DragIcon';
import EditIcon from './assets/EditIcon';
import CloseIcon from './assets/CloseIcon';

export default function ColumnHeader({ title, todosCount, completedCount, onEditColumnTitle, onDeleteColumn }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onEditColumnTitle(titleText.trim());
      setIsEditingTitle(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveTitle();
    if (e.key === 'Escape') {
      setTitleText(title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="column-header">
      {isEditingTitle ? (
        <>
          <input 
            value={titleText} 
            onChange={(e) => setTitleText(e.target.value)} 
            onKeyDown={handleKeyDown}
            className="column-title-input"
            autoFocus
          />
          <button onClick={handleSaveTitle} className="btn-icon">Save</button>
        </>
      ) : (
        <>
          <div className="column-title-group">
            <span className="drag-handle">
              <DragIcon size={14} color="#64748B" />
            </span>
            <h3>{title}</h3>
            <span className="task-count">{completedCount}/{todosCount}</span>
          </div>
          <div className="column-header-actions">
            <button onClick={() => setIsEditingTitle(true)} className="btn-icon">
              <EditIcon size={14} color="currentColor" />
            </button>
            <button onClick={onDeleteColumn} className="btn-icon btn-delete">
              <CloseIcon size={14} color="currentColor" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}