import TodoItem from './TodoItem';

export default function TodoList({ todos, onDeleteTodo }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoItem 
          key={index} 
          index={index} 
          todo={todo} 
          onDeleteTodo={onDeleteTodo} 
        />
      ))}
    </ul>
  );
}