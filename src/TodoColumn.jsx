import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import ColumnHeader from './ColumnHeader';
import ColumnFooter from './ColumnFooter';
import TodoItem from './TodoItem';
import { FILTER_TYPES } from './constants';

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
  const { setNodeRef } = useDroppable({ id: columnId });

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(globalSearchQuery.toLowerCase());
    const matchesFilter = filterType === FILTER_TYPES.ALL 
        ? true : filterType === FILTER_TYPES.COMPLETED ? todo.isCompleted : !todo.isCompleted;
    return matchesSearch && matchesFilter;
  });

  const areAllSelected = filteredTodos.length > 0 && filteredTodos.every(todo => todo.isSelected);
  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <div className="todo-column" ref={setNodeRef}>
      <ColumnHeader 
        title={title}
        todosCount={todos.length}
        completedCount={completedCount}
        onEditColumnTitle={(newTitle) => onEditColumnTitle(columnId, newTitle)}
        onDeleteColumn={() => onDeleteColumn(columnId)}
      />

      <div className="select-all-row">
        <input 
            type="checkbox" 
            className="todo-checkbox select-checkbox"
            checked={areAllSelected}
            onChange={(e) => onSelectAllInColumn(columnId, filteredTodos.map(t => t.id), e.target.checked)}
        />
        <span>Select all</span>
      </div>

      <ul className="todo-list">
        <SortableContext items={filteredTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
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
        </SortableContext>
      </ul>

      <ColumnFooter onAddTodo={(text) => onAddTodo(columnId, text)} />
    </div>
  );
}