import { useState } from 'react';

export default function ColumnFooter({ onAddTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="column-footer">
      <div className="todo-form">
        <input 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="todo-input"
        />
        <button onClick={handleSubmit} className="btn-add-circle">
          +
        </button>
      </div>
    </div>
  );
}