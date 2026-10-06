import { useState } from 'react';

export default function ColumnFooter({ onAddTodo }) {
  const [text, setText] = useState('');
  
  const isTextValid = text.trim().length >= 3;

  const handleSubmit = () => {
    if (isTextValid) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="column-footer">
        <div className="todo-form">
          <input 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="todo-input"
          />
          <button onClick={handleSubmit} className="btn-add-circle" disabled={!isTextValid}>
            +
          </button>
        </div>
      </div>
      {!isTextValid && text.length > 0 && (
        <span className="error-text-inline">Minimum 3 characters</span>
      )}
    </div>
  );
}