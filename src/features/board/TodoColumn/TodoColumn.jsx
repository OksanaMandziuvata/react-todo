import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Checkbox from '@/shared/ui/Checkbox';
import ColumnHeader from '@/features/board/ColumnHeader';
import ColumnFooter from '@/features/board/ColumnFooter';
import TodoItem from '@/features/board/TodoItem/TodoItem';
import { FILTER_TYPES } from '@/features/board/constants';
import './TodoColumn.scss';

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
  onOpenTask,
  onSelectAllInColumn,
  onEditColumnTitle,
  onDeleteColumn
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: columnId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(globalSearchQuery.toLowerCase());
    const matchesFilter = filterType === FILTER_TYPES.ALL 
        ? true : filterType === FILTER_TYPES.COMPLETED ? todo.isCompleted : !todo.isCompleted;
    return matchesSearch && matchesFilter;
  });

  const areAllSelected = filteredTodos.length > 0 && filteredTodos.every(todo => todo.isSelected);
  const completedCount = todos.filter(t => t.isCompleted).length;

  return (
    <div className="todo-column" ref={setNodeRef} style={style}>
      <ColumnHeader 
        title={title}
        todosCount={todos.length}
        completedCount={completedCount}
        onEditColumnTitle={(newTitle) => onEditColumnTitle(columnId, newTitle)}
        onDeleteColumn={() => onDeleteColumn(columnId)}
        dragAttributes={attributes}
        dragListeners={listeners}
      />

      <div className="select-all-row">
        <Checkbox
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
              onOpenTask={onOpenTask}
            />
          ))}
        </SortableContext>
      </ul>

      <ColumnFooter onAddTodo={(text) => onAddTodo(columnId, text)} />
    </div>
  );
}