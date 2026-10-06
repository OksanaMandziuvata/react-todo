import { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Navbar from '../../../shared/ui/Navbar/Navbar';
import BulkActionsBar from '../../../shared/ui/BulkActionsBar/BulkActionsBar';
import TodoColumn from '../TodoColumn/TodoColumn';
import Modal from '../../../shared/ui/Modal/Modal';
import { FILTER_TYPES } from '../constants';
import './Board.scss';

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterType, setFilterType] = useState(FILTER_TYPES.ALL); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, action: null, message: '' });

  const isColumnTitleValid = newColumnTitle.trim().length >= 3;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const findColumnByTodoId = (id) => columns.find(col => col.todos.some(t => t.id.toString() === id.toString()));

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const activeColumn = findColumnByTodoId(activeId);
    const overColumn = findColumnByTodoId(overId) || columns.find(c => c.id.toString() === overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    setColumns(prev => {
      const activeItems = activeColumn.todos;
      const overItems = overColumn.todos;
      const activeIndex = activeItems.findIndex(t => t.id.toString() === activeId);
      const overIndex = overItems.findIndex(t => t.id.toString() === overId);

      const newIndex = overIndex >= 0 ? overIndex : overItems.length;

      return prev.map(col => {
        if (col.id === activeColumn.id) {
          return { ...col, todos: col.todos.filter(t => t.id.toString() !== activeId) };
        }
        if (col.id === overColumn.id) {
          const newTodos = [...col.todos];
          newTodos.splice(newIndex, 0, activeItems[activeIndex]);
          return { ...col, todos: newTodos };
        }
        return col;
      });
    });
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeColumn = findColumnByTodoId(activeId);
    const overColumn = findColumnByTodoId(overId) || columns.find(c => c.id.toString() === overId);

    if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) return;

    const activeIndex = activeColumn.todos.findIndex(t => t.id.toString() === activeId);
    const overIndex = overColumn.todos.findIndex(t => t.id.toString() === overId);

    if (activeIndex !== overIndex) {
      setColumns(prev => prev.map(col => {
        if (col.id === activeColumn.id) {
          return { ...col, todos: arrayMove(col.todos, activeIndex, overIndex) };
        }
        return col;
      }));
    }
  };

  const handleConfirmAddColumn = () => {
    if (isColumnTitleValid) {
      const newColumn = { id: Date.now().toString(), title: newColumnTitle.trim(), todos: [] };
      setColumns(prev => [...prev, newColumn]);
      setIsModalOpen(false);
      setNewColumnTitle('');
    }
  };

  const promptDelete = (action, message = "Are you sure you want to delete?") => {
    setDeleteConfig({ isOpen: true, action, message });
  };

  const confirmDelete = () => {
    if (deleteConfig.action) deleteConfig.action();
    setDeleteConfig({ isOpen: false, action: null, message: '' });
  };

  const handleDeleteColumn = (columnId) => {
    promptDelete(() => setColumns(prev => prev.filter(col => col.id !== columnId)));
  };

  const handleDeleteTodo = (columnId, todoId) => {
    promptDelete(() => setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, todos: col.todos.filter(todo => todo.id !== todoId) } : col
    )));
  };

  const handleBulkDelete = () => {
    promptDelete(() => setColumns(prev => prev.map(col => ({ ...col, todos: col.todos.filter(t => !t.isSelected) }))));
  };

  const handleEditColumnTitle = (columnId, newTitle) => {
    setColumns(prev => prev.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
  };

  const handleAddTodo = (columnId, text) => {
    const newTodo = { id: Date.now().toString(), text, isCompleted: false, isSelected: false };
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, todos: [...col.todos, newTodo] } : col
    ));
  };

  const handleEditTodo = (columnId, todoId, newText) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, text: newText } : todo) }
        : col
    ));
  };

  const handleToggleSelect = (columnId, todoId) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, isSelected: !todo.isSelected } : todo) }
        : col
    ));
  };

  const handleToggleComplete = (columnId, todoId) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo) }
        : col
    ));
  };

  const handleSelectAllInColumn = (columnId, visibleIds, selectAll) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, todos: col.todos.map(todo => visibleIds.includes(todo.id) ? { ...todo, isSelected: selectAll } : todo) } : col
    ));
  };

  const selectedCount = columns.reduce((total, col) => total + col.todos.filter(t => t.isSelected).length, 0);

  const handleClearSelection = () => {
    setColumns(prev => prev.map(col => ({ ...col, todos: col.todos.map(t => ({ ...t, isSelected: false })) })));
  };

  const handleBulkMarkComplete = () => {
    setColumns(prev => prev.map(col => ({ ...col, todos: col.todos.map(t => t.isSelected ? { ...t, isCompleted: true } : t) })));
  };

  const handleBulkMarkIncomplete = () => {
    setColumns(prev => prev.map(col => ({ ...col, todos: col.todos.map(t => t.isSelected ? { ...t, isCompleted: false } : t) })));
  };

  const handleBulkMove = (e) => {
    const targetColumnId = Number(e.target.value);
    if (!targetColumnId) return;

    setColumns(prevColumns => {
      let itemsToMove = [];
      prevColumns.forEach(col => {
        itemsToMove = [...itemsToMove, ...col.todos.filter(t => t.isSelected)];
      });
      const cleanedItems = itemsToMove.map(item => ({ ...item, isSelected: false }));

      return prevColumns.map(col => {
        if (col.id === targetColumnId) {
          return { ...col, todos: [...col.todos.filter(t => !t.isSelected), ...cleanedItems] };
        }
        return { ...col, todos: col.todos.filter(t => !t.isSelected) };
      });
    });
    e.target.value = ""; 
  };

  return (
    <>
      <Navbar 
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        filterType={filterType}
        setFilterType={setFilterType}
        onOpenModal={() => setIsModalOpen(true)}
      />

      <BulkActionsBar 
        selectedCount={selectedCount}
        onClearSelection={handleClearSelection}
        onBulkMarkComplete={handleBulkMarkComplete}
        onBulkMarkIncomplete={handleBulkMarkIncomplete}
        onBulkMove={handleBulkMove}
        onBulkDelete={handleBulkDelete}
        columns={columns}
      />
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="columns-container">
          {columns.length === 0 ? (
            <div className="empty-board-message">
              <h3>Your board is empty</h3>
              <p>Click "+ Add Column" in the top right to get started.</p>
            </div>
          ) : (
            columns.map(column => (
              <TodoColumn
                key={column.id}
                columnId={column.id}
                title={column.title}
                todos={column.todos}
                globalSearchQuery={globalSearch}
                filterType={filterType}
                onAddTodo={handleAddTodo}
                onDeleteTodo={handleDeleteTodo}
                onEditTodo={handleEditTodo}
                onToggleSelect={handleToggleSelect}
                onToggleComplete={handleToggleComplete} 
                onSelectAllInColumn={handleSelectAllInColumn}
                onEditColumnTitle={handleEditColumnTitle}
                onDeleteColumn={handleDeleteColumn}
              />
            ))
          )}
        </div>
      </DndContext>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setNewColumnTitle(''); }}
        onConfirm={handleConfirmAddColumn}
        title="Add new column"
        mode="input"
        value={newColumnTitle}
        onChange={setNewColumnTitle}
        isValid={isColumnTitleValid}
        errorMessage="Title must be at least 3 characters long."
        confirmText="Add"
      />

      <Modal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig({ isOpen: false, action: null, message: '' })}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        mode="confirm"
        message={deleteConfig.message}
        isValid={true}
        confirmText="Delete"
      />
    </>
  );
}