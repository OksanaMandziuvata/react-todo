import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditIcon from '../../../assets/EditIcon';
import TrashIcon from '../../../assets/TrashIcon';
import DragIcon from '../../../assets/DragIcon';
import CheckIcon from '../../../assets/CheckIcon';
import './TodoItem.scss';

export default function TodoItem({ todo, columnId, onDeleteTodo, onEditTodo, onToggleSelect, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isValid = editText.trim().length >= 3;

  const handleSave = () => {
    if (isValid) {
      onEditTodo(columnId, todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isValid) handleSave();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li 
      ref={setNodeRef} 
      style={style} 
      className={`todo-item ${todo.isSelected ? 'selected' : ''}`}
    >
      <div className="todo-item-left">
        <input 
          type="checkbox" 
          checked={todo.isSelected} 
          onChange={() => onToggleSelect(columnId, todo.id)} 
          className="todo-checkbox select-checkbox"
          title="Select task"
          aria-label="Select task"
        />
        
        <span 
          className="drag-handle todo-item-drag-handle"
          {...attributes} 
          {...listeners}
        >
          <DragIcon size={14} color="#64748B" />
        </span>
        
        <input 
          type="checkbox" 
          checked={todo.isCompleted} 
          onChange={() => onToggleComplete(columnId, todo.id)} 
          className="todo-checkbox complete-checkbox"
          title={todo.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          aria-label={todo.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        />
        
        {isEditing ? (
          <div className="edit-todo-container">
            <input 
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="edit-todo-input"
            />
            {!isValid && editText.length > 0 && <span className="error-text-inline error-text-padding">Minimum 3 chars</span>}
          </div>
        ) : (
          <span className={todo.isCompleted ? 'completed-text' : 'todo-text-content'}>
            {todo.text}
          </span>
        )}
      </div>
      
      <div className="todo-item-actions">
          {isEditing ? (
            <button className="btn-icon" onClick={handleSave} disabled={!isValid}>
              <CheckIcon size={14} color="currentColor" />
            </button>
          ) : (
            <button className="btn-icon" onClick={() => setIsEditing(true)}>
              <EditIcon size={14} color="currentColor" />
            </button>
          )}
          
          <button className="btn-icon btn-delete" onClick={() => onDeleteTodo(columnId, todo.id)}>
            <TrashIcon size={14} color="currentColor" />
          </button>
      </div>
    </li>
  );
}