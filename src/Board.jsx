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
      setColumns(prev => [...prev, newColumn]);
      setIsModalOpen(false);
      setNewColumnTitle('');
    }
  };

  const handleDeleteColumn = (columnId) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
  };

  const handleEditColumnTitle = (columnId, newTitle) => {
    setColumns(prev => prev.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
  };

  const handleAddTodo = (columnId, text) => {
    const newTodo = { id: Date.now(), text, isCompleted: false, isSelected: false };
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, todos: [...col.todos, newTodo] } : col
    ));
  };

  const handleDeleteTodo = (columnId, todoId) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, todos: col.todos.filter(todo => todo.id !== todoId) } : col
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

  const handleBulkDelete = () => {
    setColumns(prev => prev.map(col => ({ 
      ...col, 
      todos: col.todos.filter(t => {
        const matchesSearch = t.text.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesFilter = filterType === 'All' 
            ? true : filterType === 'Completed' ? t.isCompleted : !t.isCompleted;
        return !(t.isSelected && matchesSearch && matchesFilter);
      }) 
    })));
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
              onAddTodo={(text) => handleAddTodo(column.id, text)}
              onDeleteTodo={handleDeleteTodo}
              onEditTodo={handleEditTodo}
              onToggleSelect={handleToggleSelect}
              onToggleComplete={handleToggleComplete} 
              onSelectAllInColumn={handleSelectAllInColumn}
              onEditColumnTitle={(newTitle) => handleEditColumnTitle(column.id, newTitle)}
              onDeleteColumn={() => handleDeleteColumn(column.id)}
            />
          ))
        )}
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setNewColumnTitle(''); }}
        onConfirm={handleConfirmAddColumn}
        value={newColumnTitle}
        onChange={setNewColumnTitle}
      />
    </>
  );
}