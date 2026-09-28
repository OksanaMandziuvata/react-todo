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

  const handleConfirmAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn = { id: Date.now(), title: newColumnTitle.trim(), todos: [] };
      setColumns([...columns, newColumn]);
      setIsModalOpen(false);
      setNewColumnTitle('');
    }
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(columns.filter(col => col.id !== columnId));
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

  const handleDeleteTodo = (columnId, todoId) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, todos: col.todos.filter(todo => todo.id !== todoId) } : col
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

  const handleSelectAllInColumn = (columnId, visibleIds, selectAll) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, todos: col.todos.map(todo => visibleIds.includes(todo.id) ? { ...todo, isSelected: selectAll } : todo) } : col
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

  const handleBulkDelete = () => {
    setColumns(columns.map(col => ({ ...col, todos: col.todos.filter(t => !t.isSelected) })));
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
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAddColumn}
        value={newColumnTitle}
        onChange={setNewColumnTitle}
      />
    </>
  );
}