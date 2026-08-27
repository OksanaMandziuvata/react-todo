import { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = (text) => {
    setTodos([...todos, text]);
  };

  const handleDeleteTodo = (indexToRemove) => {
    setTodos(todos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <h1>Todo</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} />
    </div>
  );
}