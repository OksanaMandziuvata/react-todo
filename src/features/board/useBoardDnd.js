import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

export default function useBoardDnd(columns, setColumns) {
  const [activeId, setActiveId] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const findColumnByTodoId = (id) =>
    columns.find((column) => column.todos.some((todo) => todo.id.toString() === id.toString()));

  const findColumnById = (id) =>
    columns.find((column) => column.id.toString() === id.toString());

  const handleDragStart = ({ active }) => {
    const id = active.id.toString();
    const column = findColumnById(id);
    const parentColumn = column || findColumnByTodoId(id);
    const item = column || parentColumn?.todos.find((todo) => todo.id.toString() === id);

    setActiveId(active.id);
    setActiveItem(item || null);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId || findColumnById(activeId)) return;

    const activeColumn = findColumnByTodoId(activeId);
    const overColumn = findColumnByTodoId(overId) || findColumnById(overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    setColumns((prev) => {
      const sourceColumn = prev.find((column) => column.id === activeColumn.id);
      const targetColumn = prev.find((column) => column.id === overColumn.id);
      const activeIndex = sourceColumn.todos.findIndex((todo) => todo.id.toString() === activeId);
      const overIndex = targetColumn.todos.findIndex((todo) => todo.id.toString() === overId);
      const newIndex = overIndex >= 0 ? overIndex : targetColumn.todos.length;
      const movedTodo = sourceColumn.todos[activeIndex];

      return prev.map((column) => {
        if (column.id === sourceColumn.id) {
          return { ...column, todos: column.todos.filter((todo) => todo.id.toString() !== activeId) };
        }
        if (column.id === targetColumn.id) {
          const todos = [...column.todos];
          todos.splice(newIndex, 0, movedTodo);
          return { ...column, todos };
        }
        return column;
      });
    });
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    setActiveItem(null);
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    const activeColumnItem = findColumnById(activeId);

    if (activeColumnItem) {
      const overColumn = findColumnByTodoId(overId) || findColumnById(overId);
      if (!overColumn || activeColumnItem.id === overColumn.id) return;

      const activeIndex = columns.findIndex((column) => column.id === activeColumnItem.id);
      const overIndex = columns.findIndex((column) => column.id === overColumn.id);
      setColumns((prev) => arrayMove(prev, activeIndex, overIndex));
      return;
    }

    const activeColumn = findColumnByTodoId(activeId);
    const overColumn = findColumnByTodoId(overId) || findColumnById(overId);

    if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) return;

    const activeIndex = activeColumn.todos.findIndex((todo) => todo.id.toString() === activeId);
    const overIndex = overColumn.todos.findIndex((todo) => todo.id.toString() === overId);

    if (activeIndex !== overIndex) {
      setColumns((prev) => prev.map((column) => (
        column.id === activeColumn.id
          ? { ...column, todos: arrayMove(column.todos, activeIndex, overIndex) }
          : column
      )));
    }
  };

  return { activeId, activeItem, handleDragStart, handleDragOver, handleDragEnd };
}
