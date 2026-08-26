import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const addTodo = () => {
    if (text) {
      setTodos([...todos, text]);
      setText('');
    }
  };

  return (
    <div>
      <h1>Todo</h1>
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addTodo();
          }
        }}
      />
      <button onClick={addTodo}>
        Додати
      </button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => setTodos(todos.filter((_, i) => i !== index))}>
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}