import { useState } from 'react';

export default function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="todo-form">
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Нове завдання..."
        className="todo-input"
      />
      <button onClick={handleSubmit}>
        Додати
      </button>
    </div>
  );
}