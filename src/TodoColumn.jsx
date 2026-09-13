import ColumnHeader from './ColumnHeader';
import ColumnFooter from './ColumnFooter';
import TodoItem from './TodoItem';

export default function TodoColumn({
  columnId,
  title,
  todos,
  globalSearchQuery,
  filterType,
  onAddTodo,
  onDeleteTodo,
  onEditTodo,
  onToggleSelect,
  onToggleComplete,
  onSelectAllInColumn,
  onEditColumnTitle,
  onDeleteColumn
}) {
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(globalSearchQuery.toLowerCase());
    const matchesFilter = filterType === 'All' 
        ? true : filterType === 'Completed' ? todo.isCompleted : !todo.isCompleted;
    return matchesSearch && matchesFilter;
  });

  const areAllSelected = todos.length > 0 && todos.every(todo => todo.isSelected);
  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <div className="todo-column">
      <ColumnHeader 
        title={title}
        todosCount={todos.length}
        completedCount={completedCount}
        onEditColumnTitle={onEditColumnTitle}
        onDeleteColumn={onDeleteColumn}
      />

      <div className="select-all-row">
        <input 
            type="checkbox" 
            className="todo-checkbox select-checkbox"
            checked={areAllSelected}
            onChange={(e) => onSelectAllInColumn(columnId, e.target.checked)}
        />
        <span>Select all</span>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            columnId={columnId}
            onDeleteTodo={onDeleteTodo}
            onEditTodo={onEditTodo}
            onToggleSelect={onToggleSelect}
            onToggleComplete={onToggleComplete}
          />
        ))}
      </ul>

      <ColumnFooter onAddTodo={onAddTodo} />
    </div>
  );
}