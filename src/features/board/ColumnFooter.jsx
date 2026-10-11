import { useState } from 'react';
import Button from '@/shared/ui/Button';
import TextInput from '@/shared/ui/TextInput';

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
          <TextInput
            value={text} 
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="todo-input"
          />
          <Button onClick={handleSubmit} className="btn-add-circle" disabled={!isTextValid}>
            +
          </Button>
        </div>
      </div>
      {!isTextValid && text.length > 0 && (
        <span className="error-text-inline">Minimum 3 characters</span>
      )}
    </div>
  );
}