import { useState } from 'react';
import Navbar from './Navbar';
import BulkActionsBar from './BulkActionsBar';
import TodoColumn from './TodoColumn';
import Modal from './Modal';

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterType, setFilterType] = useState('All'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, action: null, message: '' });

  const isColumnTitleValid = newColumnTitle.trim().length >= 3;

  const handleConfirmAddColumn = () => {
    if (isColumnTitleValid) {
      const newColumn = { id: Date.now(), title: newColumnTitle.trim(), todos: [] };
      setColumns([...columns, newColumn]);
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
    setColumns(columns.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
  };

  const handleAddTodo = (columnId, text) => {
    const newTodo = { id: Date.now(), text, isCompleted: false, isSelected: false };
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, todos: [...col.todos, newTodo] } : col
    ));
  };

  const handleEditTodo = (columnId, todoId, newText) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, text: newText } : todo) }
        : col
    ));
  };

  const handleToggleSelect = (columnId, todoId) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, isSelected: !todo.isSelected } : todo) }
        : col
    ));
  };

  const handleToggleComplete = (columnId, todoId) => {
    setColumns(columns.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo) }
        : col
    ));
  };

  const handleSelectAllInColumn = (columnId, selectAll) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, todos: col.todos.map(todo => ({ ...todo, isSelected: selectAll })) } : col
    ));
  };

  const selectedCount = columns.reduce((total, col) => total + col.todos.filter(t => t.isSelected).length, 0);

  const handleClearSelection = () => {
    setColumns(columns.map(col => ({ ...col, todos: col.todos.map(t => ({ ...t, isSelected: false })) })));
  };

  const handleBulkMarkComplete = () => {
    setColumns(columns.map(col => ({ ...col, todos: col.todos.map(t => t.isSelected ? { ...t, isCompleted: true } : t) })));
  };

  const handleBulkMarkIncomplete = () => {
    setColumns(columns.map(col => ({ ...col, todos: col.todos.map(t => t.isSelected ? { ...t, isCompleted: false } : t) })));
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
      
      <div className="columns-container">
        {columns.map(column => (
          <TodoColumn
            key={column.id}
            columnId={column.id}
            title={column.title}
            todos={column.todos}
            globalSearchQuery={globalSearch}
            filterType={filterType}
            onAddTodo={(text) => handleAddTodo(column.id, text)}
            onDeleteTodo={handleDeleteTodo}
            onEditTodo={handleEditTodo}
            onToggleSelect={handleToggleSelect}
            onToggleComplete={handleToggleComplete} 
            onSelectAllInColumn={handleSelectAllInColumn}
            onEditColumnTitle={(newTitle) => handleEditColumnTitle(column.id, newTitle)}
            onDeleteColumn={() => handleDeleteColumn(column.id)}
          />
        ))}
      </div>

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