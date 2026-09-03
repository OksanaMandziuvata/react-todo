import { useState } from 'react';
import TodoColumn from './TodoColumn';
import './styles.css';

export default function App() {
  const [columnTitle, setColumnTitle] = useState('To Do');
  const [todos, setTodos] = useState([]);
  const [isColumnVisible, setIsColumnVisible] = useState(true);

  const handleAddTodo = (text) => {
    setTodos([...todos, text]);
  };

  const handleDeleteTodo = (indexToRemove) => {
    setTodos(todos.filter((_, index) => index !== indexToRemove));
  };

  const handleEditTodo = (indexToEdit, newText) => {
    const newTodos = [...todos];
    newTodos[indexToEdit] = newText;
    setTodos(newTodos);
  };

  return (
    <div className="app-container">
      {!isColumnVisible && (
        <button onClick={() => setIsColumnVisible(true)} className="add-column-btn">
          + Додати колонку
        </button>
      )}

      {isColumnVisible && (
        <TodoColumn
          title={columnTitle}
          todos={todos}
          onAddTodo={handleAddTodo}
          onDeleteTodo={handleDeleteTodo}
          onEditTodo={handleEditTodo}
          onEditColumnTitle={setColumnTitle}
          onDeleteColumn={() => setIsColumnVisible(false)}
        />
      )}
    </div>
  );
}