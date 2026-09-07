export default function TodoItem({ todo, index, onDeleteTodo }) {
  return (
    <li className="todo-item">
      <span>{todo}</span>
      <button onClick={() => onDeleteTodo(index)}>
        Видалити
      </button>
    </li>
  );
}