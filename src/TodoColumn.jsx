import { useState } from 'react';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

export default function TodoColumn({
  title,
  todos,
  onAddTodo,
  onDeleteTodo,
  onEditColumnTitle,
  onDeleteColumn
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onEditColumnTitle(titleText.trim());
      setIsEditingTitle(false);
    }
  };

  const filteredTodos = todos.filter(todo =>
    todo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="todo-column">
      <div className="column-header">
        {isEditingTitle ? (
          <>
            <input 
              value={titleText} 
              onChange={(e) => setTitleText(e.target.value)} 
              className="column-title-input"
            />
            <button onClick={handleSaveTitle}>OK</button>
          </>
        ) : (
          <>
            <h3>{title}</h3>
            <div className="column-header-actions">
              <button onClick={() => setIsEditingTitle(true)}>Ред.</button>
              <button onClick={onDeleteColumn}>X</button>
            </div>
          </>
        )}
      </div>

      <input
        placeholder="Пошук завдань..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <TodoForm onAddTodo={onAddTodo} />

      <ul className="todo-list">
        {filteredTodos.map((todo, index) => (
          <TodoItem
            key={index}
            index={index}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}