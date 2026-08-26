export default function TodoItem({ todo, index, onDeleteTodo }) {
  return (
    <li>
      {todo}
      <button onClick={() => onDeleteTodo(index)}>
        Видалити
      </button>
    </li>
  );
}