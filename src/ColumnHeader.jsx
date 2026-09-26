import { useState } from 'react';
import DragIcon from './assets/DragIcon';
import EditIcon from './assets/EditIcon';
import CloseIcon from './assets/CloseIcon';
import CheckIcon from './assets/CheckIcon';

export default function ColumnHeader({ title, todosCount, completedCount, onEditColumnTitle, onDeleteColumn }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);
  
  const isTitleValid = titleText.trim().length >= 3;

  const handleSaveTitle = () => {
    if (isTitleValid) {
      onEditColumnTitle(titleText.trim());
      setIsEditingTitle(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isTitleValid) handleSaveTitle();
    if (e.key === 'Escape') {
      setTitleText(title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div className="column-header">
      {isEditingTitle ? (
        <div className="edit-title-wrapper">
          <div className="edit-title-group">
            <input 
              value={titleText} 
              onChange={(e) => setTitleText(e.target.value)} 
              onKeyDown={handleKeyDown}
              className="column-title-input"
              autoFocus
            />
            <button 
              onClick={handleSaveTitle} 
              className="btn-icon edit-title-btn" 
              disabled={!isTitleValid}
            >
              <CheckIcon size={14} color="currentColor" />
            </button>
          </div>
          {!isTitleValid && titleText.length > 0 && (
            <span className="error-text-inline">Minimum 3 characters</span>
          )}
        </div>
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