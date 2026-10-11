import { useState } from 'react';
import IconButton from '@/shared/ui/IconButton';
import TextInput from '@/shared/ui/TextInput';
import { CheckIcon, CloseIcon, DragIcon, EditIcon } from '@/shared/ui/icons';

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
            <TextInput
              value={titleText} 
              onChange={(e) => setTitleText(e.target.value)} 
              onKeyDown={handleKeyDown}
              className="column-title-input"
              autoFocus
            />
            <IconButton
              onClick={handleSaveTitle} 
              className="btn-icon edit-title-btn" 
              disabled={!isTitleValid}
            >
              <img src={CheckIcon} width="14" height="14" alt="" />
            </IconButton>
          </div>
          {!isTitleValid && titleText.length > 0 && (
            <span className="error-text-inline">Minimum 3 characters</span>
          )}
        </div>
      ) : (
        <>
          <div className="column-title-group">
            <span className="drag-handle">
              <img src={DragIcon} width="14" height="14" alt="" />
            </span>
            <h3>{title}</h3>
            <span className="task-count">{completedCount}/{todosCount}</span>
          </div>
          <div className="column-header-actions">
            <IconButton onClick={() => setIsEditingTitle(true)} className="btn-icon">
              <img src={EditIcon} width="14" height="14" alt="" />
            </IconButton>
            <IconButton onClick={onDeleteColumn} className="btn-icon btn-delete">
              <img src={CloseIcon} width="14" height="14" alt="" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
}