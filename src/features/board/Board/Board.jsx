import { useEffect, useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Button from '@/shared/ui/Button';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import Modal from '@/shared/ui/Modal';
import TextInput from '@/shared/ui/TextInput';
import BulkActionsBar from '@/features/board/BulkActionsBar/BulkActionsBar';
import Navbar from '@/features/board/Navbar/Navbar';
import TaskModal from '@/TaskModal';
import {
  addMockTaskPeople,
  loadTeamMembers,
  TEAM_MEMBERS_STORAGE_KEY,
} from '@/TaskModal/mockData';
import TodoColumn from '@/features/board/TodoColumn/TodoColumn';
import { FILTER_TYPES } from '@/features/board/constants';
import {
  BOARD_STORAGE_KEY,
  normalizeTaskNumbers,
  persistNextTaskNumber,
  reserveNextTaskNumber,
} from '@/features/board/taskNumbering';
import './Board.scss';

function loadBoard() {
  try {
    const storedColumns = localStorage.getItem(BOARD_STORAGE_KEY);
    if (!storedColumns) return { columns: [], error: '', needsSave: false, nextTaskNumber: 1 };

    const columns = JSON.parse(storedColumns);
    if (!Array.isArray(columns) || columns.some((column) => (
      !column || column.id == null || typeof column.title !== 'string' || !Array.isArray(column.todos)
    ))) {
      throw new Error('Saved board data has an invalid structure.');
    }
    const numberedBoard = normalizeTaskNumbers(columns);
    return {
      ...numberedBoard,
      error: '',
      needsSave: numberedBoard.changed,
    };
  } catch (error) {
    console.error('Could not load the saved board from local storage.', error);
    return {
      columns: [],
      error: 'Saved board data could not be loaded. Changes will replace it when you update the board.',
      needsSave: false,
      nextNumber: 1,
    };
  }
}

function removeTasksAndTheirLinks(columns, taskIds) {
  const removedIds = new Set(taskIds.map(id => String(id)));
  return columns.map(column => ({
    ...column,
    todos: column.todos
      .filter(todo => !removedIds.has(String(todo.id)))
      .map(todo => {
        if (!Array.isArray(todo.relatedWork)) return todo;
        const relatedWork = todo.relatedWork.filter(
          relation => !removedIds.has(String(relation.taskId))
        );
        return relatedWork.length === todo.relatedWork.length ? todo : { ...todo, relatedWork };
      }),
  }));
}

export default function Board() {
  const [initialBoard] = useState(loadBoard);
  const [initialTeam] = useState(loadTeamMembers);
  const [columns, setColumns] = useState(initialBoard.columns);
  const [teamMembers] = useState(initialTeam.members);
  const [activeTask, setActiveTask] = useState(null);
  const [storageError, setStorageError] = useState(
    [initialBoard.error, initialTeam.error].filter(Boolean).join(' ')
  );
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterType, setFilterType] = useState(FILTER_TYPES.ALL); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [deleteConfig, setDeleteConfig] = useState({ isOpen: false, action: null, message: '' });

  useEffect(() => {
    if (columns === initialBoard.columns && !initialBoard.needsSave) return;

    try {
      localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(columns));
      persistNextTaskNumber(columns, initialBoard.nextNumber);
      queueMicrotask(() => setStorageError(''));
    } catch (error) {
      console.error('Could not save the board to local storage.', error);
      queueMicrotask(() => setStorageError('Your changes could not be saved in this browser.'));
    }
  }, [columns, initialBoard.columns, initialBoard.needsSave, initialBoard.nextNumber]);

  useEffect(() => {
    if (!initialTeam.shouldSeed) return;

    try {
      localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(initialTeam.members));
    } catch (error) {
      console.error('Could not save the default team members to local storage.', error);
      queueMicrotask(() => setStorageError('The default team members could not be saved in this browser.'));
    }
  }, [initialTeam]);

  const isColumnTitleValid = newColumnTitle.trim().length >= 3;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    setColumns(prev => {
      const activeColumn = prev.find(col => col.todos.some(todo => todo.id.toString() === activeId));
      const overColumn = prev.find(col => col.todos.some(todo => todo.id.toString() === overId))
        || prev.find(column => column.id.toString() === overId);

      if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return prev;

      const activeItems = activeColumn.todos;
      const overItems = overColumn.todos;
      const activeIndex = activeItems.findIndex(t => t.id.toString() === activeId);
      const overIndex = overItems.findIndex(t => t.id.toString() === overId);

      if (activeIndex < 0) return prev;

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

    setColumns(prev => {
      const activeColumn = prev.find(col => col.todos.some(todo => todo.id.toString() === activeId));
      const overColumn = prev.find(col => col.todos.some(todo => todo.id.toString() === overId))
        || prev.find(column => column.id.toString() === overId);

      if (!activeColumn || !overColumn || activeColumn.id !== overColumn.id) return prev;

      const activeIndex = activeColumn.todos.findIndex(todo => todo.id.toString() === activeId);
      const overIndex = activeColumn.todos.findIndex(todo => todo.id.toString() === overId);

      if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) return prev;

      return prev.map(column => column.id === activeColumn.id
        ? { ...column, todos: arrayMove(column.todos, activeIndex, overIndex) }
        : column
      );
    });
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
    promptDelete(() => setColumns(prev => {
      const removedTaskIds = prev
        .find(column => column.id === columnId)
        ?.todos.map(todo => todo.id) || [];
      return removeTasksAndTheirLinks(
        prev.filter(column => column.id !== columnId),
        removedTaskIds
      );
    }));
  };

  const handleDeleteTodo = (columnId, todoId) => {
    promptDelete(() => setColumns(prev => (
      prev.some(column => column.id === columnId && column.todos.some(todo => todo.id === todoId))
        ? removeTasksAndTheirLinks(prev, [todoId])
        : prev
    )));
  };

  const handleBulkDelete = () => {
    promptDelete(() => setColumns(prev => {
      const removedTaskIds = prev.flatMap(column => (
        column.todos.filter(todo => todo.isSelected).map(todo => todo.id)
      ));
      return removeTasksAndTheirLinks(prev, removedTaskIds);
    }));
  };

  const handleEditColumnTitle = (columnId, newTitle) => {
    setColumns(prev => prev.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
  };

  const handleAddTodo = (columnId, text) => {
    let number;
    try {
      number = reserveNextTaskNumber(columns);
    } catch (error) {
      console.error('Could not reserve a task number from local storage.', error);
      setStorageError('A task number could not be saved in this browser, so the task was not added.');
      return;
    }
    const newTodo = {
      id: Date.now().toString(),
      number,
      text,
      isCompleted: false,
      isSelected: false,
    };
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, todos: [...col.todos, newTodo] } : col
    ));
  };

  const handleReserveTaskNumber = () => {
    try {
      return reserveNextTaskNumber(columns);
    } catch (error) {
      console.error('Could not reserve a task number from local storage.', error);
      setStorageError('A task number could not be saved in this browser.');
      return null;
    }
  };

  const handleEditTodo = (columnId, todoId, newText) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId
        ? { ...col, todos: col.todos.map(todo => todo.id === todoId ? { ...todo, text: newText } : todo) }
        : col
    ));
  };

  const handleRemoveTaskRelation = (sourceTaskId, relationId, targetTaskId, relationType) => {
    setColumns(prev => prev.map(column => ({
      ...column,
      todos: column.todos.map(todo => {
        if (String(todo.id) !== String(sourceTaskId) || !Array.isArray(todo.relatedWork)) return todo;
        return {
          ...todo,
          relatedWork: todo.relatedWork.filter(relation => (
            relationId
              ? relation.id !== relationId
              : !(String(relation.taskId) === String(targetTaskId) && relation.type === relationType)
          )),
        };
      }),
    })));
  };

  const handleSaveTask = (taskDraft) => {
    const targetColumn = columns.find(column => String(column.id) === String(taskDraft.columnId));
    const taskExists = columns.some(column => column.todos.some(todo => String(todo.id) === String(taskDraft.id)));

    if (!targetColumn || !taskExists) {
      console.error('Could not save task changes because the task or destination column no longer exists.');
      return false;
    }

    const taskUpdates = { ...taskDraft };
    delete taskUpdates.columnId;
    setColumns(prev => {
      let taskToSave;
      const columnsWithoutTask = prev.map(column => ({
        ...column,
        todos: column.todos.filter(todo => {
          if (String(todo.id) !== String(taskDraft.id)) return true;
          taskToSave = { ...todo, ...taskUpdates };
          return false;
        }),
      }));

      if (!taskToSave) return prev;
      return columnsWithoutTask.map(column => (
        String(column.id) === String(targetColumn.id)
          ? { ...column, todos: [...column.todos, taskToSave] }
          : column
      ));
    });
    return true;
  };

  const handleOpenTask = (columnId, task) => {
    setActiveTask({ ...addMockTaskPeople(task), columnId });
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
                onOpenTask={handleOpenTask}
                onSelectAllInColumn={handleSelectAllInColumn}
                onEditColumnTitle={handleEditColumnTitle}
                onDeleteColumn={handleDeleteColumn}
              />
            ))
          )}
        </div>
      </DndContext>

      {storageError && <div className="board-storage-error" role="alert">{storageError}</div>}

      <TaskModal
        key={activeTask?.id ?? 'closed'}
        activeTask={activeTask}
        columns={columns}
        assignees={[...new Set([
          ...teamMembers,
          ...columns.flatMap(column => column.todos.map(todo => todo.assignee).filter(Boolean)),
        ])]}
        onClose={() => setActiveTask(null)}
        onSaveTask={handleSaveTask}
        onRemoveTaskRelation={handleRemoveTaskRelation}
        onReserveTaskNumber={handleReserveTaskNumber}
      />

      {isModalOpen && (
        <div
          className="add-column-dialog"
          onClick={(event) => {
            if (event.target.classList.contains('modal-overlay')) {
              setIsModalOpen(false);
              setNewColumnTitle('');
            }
          }}
        >
          <Modal
            title="Add new column"
            footer={
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewColumnTitle('');
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmAddColumn} disabled={!isColumnTitleValid}>
                  Add
                </Button>
              </>
            }
          >
            <TextInput
              autoFocus
              className="modal-input"
              value={newColumnTitle}
              onChange={(event) => setNewColumnTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && isColumnTitleValid) handleConfirmAddColumn();
                if (event.key === 'Escape') {
                  setIsModalOpen(false);
                  setNewColumnTitle('');
                }
              }}
              placeholder="Column title..."
            />
            {!isColumnTitleValid && newColumnTitle.length > 0 && (
              <div className="error-text">Title must be at least 3 characters long.</div>
            )}
          </Modal>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfig.isOpen}
        message={deleteConfig.message}
        onCancel={() => setDeleteConfig({ isOpen: false, action: null, message: '' })}
        onConfirm={confirmDelete}
      />
    </>
  );
}