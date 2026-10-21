import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Checkbox from '@/shared/ui/Checkbox';
import IconButton from '@/shared/ui/IconButton';
import TextInput from '@/shared/ui/TextInput';
import { CheckIcon, DragIcon, EditIcon, TrashIcon } from '@/shared/ui/icons';
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
        <Checkbox
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
          <img src={DragIcon} width="14" height="14" alt="" />
        </span>
        
        <Checkbox
          checked={todo.isCompleted} 
          onChange={() => onToggleComplete(columnId, todo.id)} 
          className="todo-checkbox complete-checkbox"
          title={todo.isCompleted ? "Mark as incomplete" : "Mark as complete"}
          aria-label={todo.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        />
        
        {isEditing ? (
          <div className="edit-todo-container">
            <TextInput
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
            <IconButton
              className="btn-icon"
              onClick={handleSave}
              disabled={!isValid}
              ariaLabel="Save item"
            >
              <img src={CheckIcon} width="14" height="14" alt="" />
            </IconButton>
          ) : (
            <IconButton
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              ariaLabel="Edit item"
            >
              <img src={EditIcon} width="14" height="14" alt="" />
            </IconButton>
          )}
          
          <IconButton
            className="btn-icon btn-delete"
            onClick={() => onDeleteTodo(columnId, todo.id)}
            ariaLabel="Delete item"
          >
            <img src={TrashIcon} width="14" height="14" alt="" />
          </IconButton>
      </div>
    </li>
  );
}