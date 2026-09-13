import { useState } from 'react';

export default function ColumnHeader({ title, todosCount, completedCount, onEditColumnTitle, onDeleteColumn }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onEditColumnTitle(titleText.trim());
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
            className="column-title-input"
            autoFocus
          />
          <button onClick={handleSaveTitle} className="btn-icon">Save</button>
        </>
      ) : (
        <>
          <div className="column-title-group">
            <span className="drag-handle">::</span>
            <h3>{title}</h3>
            <span className="task-count">{completedCount}/{todosCount}</span>
          </div>
          <div className="column-header-actions">
            <button onClick={() => setIsEditingTitle(true)} className="btn-icon">Edit</button>
            <button onClick={onDeleteColumn} className="btn-icon btn-delete">Del</button>
          </div>
        </>
      )}
    </div>
  );
}