import { useState } from 'react';
import TodoColumn from './TodoColumn';
import './styles.css';

export default function App() {
  const [columns, setColumns] = useState([
    { id: 1, title: 'To Do', todos: [] }
  ]);

  const handleAddColumn = () => {
    const newColumn = {
      id: Date.now(),
      title: 'Нова колонка',
      todos: []
    };
    setColumns([...columns, newColumn]);
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
  };

  const handleEditColumnTitle = (columnId, newTitle) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
  };

  const handleAddTodo = (columnId, text) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, todos: [...col.todos, text] } : col
    ));
  };

  const handleDeleteTodo = (columnId, todoIndex) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, todos: col.todos.filter((_, index) => index !== todoIndex) } 
        : col
    ));
  };

  return (
    <div className="app-container">
      <button onClick={handleAddColumn} className="add-column-btn">
        + Додати колонку
      </button>
      
      <div className="columns-container">
        {columns.map(column => (
          <TodoColumn
            key={column.id}
            title={column.title}
            todos={column.todos}
            onAddTodo={(text) => handleAddTodo(column.id, text)}
            onDeleteTodo={(todoIndex) => handleDeleteTodo(column.id, todoIndex)}
            onEditColumnTitle={(newTitle) => handleEditColumnTitle(column.id, newTitle)}
            onDeleteColumn={() => handleDeleteColumn(column.id)}
          />
        ))}
      </div>
    </div>
  );
}