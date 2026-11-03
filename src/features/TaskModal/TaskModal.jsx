import { useCallback, useEffect, useState } from 'react';
import ConfirmDialog from '@/shared/ui/ConfirmDialog';
import TaskModalHeader from './TaskModalHeader/TaskModalHeader';
import TaskModalLeftColumn from './LeftColumn/TaskModalLeftColumn';
import TaskModalRightColumn from './RightColumn/TaskModalRightColumn';
import TaskModalTabs from './TaskModalTabs/TaskModalTabs';
import './TaskModal.scss';

const isSameTask = (first, second) => JSON.stringify(first) === JSON.stringify(second);

export default function TaskModal({
  activeTask,
  columns,
  assignees,
  onClose,
  onSaveTask,
  onRemoveTaskRelation,
  onReserveTaskNumber,
}) {
  const [draftTask, setDraftTask] = useState(activeTask);
  const [savedTask, setSavedTask] = useState(activeTask);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);
  const isDirty = Boolean(draftTask && savedTask && !isSameTask(draftTask, savedTask));

  const saveDraft = useCallback(() => {
    if (!draftTask || !isDirty) return true;
    const savedTaskDraft = draftTask;
    const saved = onSaveTask(savedTaskDraft);
    if (saved === false) return false;
    setDraftTask(savedTaskDraft);
    setSavedTask(savedTaskDraft);
    return true;
  }, [draftTask, isDirty, onSaveTask]);

  const saveAndClose = useCallback(() => {
    if (saveDraft()) onClose();
  }, [onClose, saveDraft]);

  const requestClose = useCallback(() => {
    if (isDirty) {
      setIsDiscardConfirmOpen(true);
      return;
    }
    onClose();
  }, [isDirty, onClose]);

  useEffect(() => {
    if (!activeTask) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isDiscardConfirmOpen) requestClose();
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTask, isDiscardConfirmOpen, requestClose, saveDraft]);

  if (!activeTask || !draftTask) return null;

  const updateDraft = (updates) => {
    setDraftTask((currentTask) => ({ ...currentTask, ...updates }));
  };

  return (
    <div
      className={`task-modal-overlay${isExpanded ? ' task-modal-overlay--expanded' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section className="task-modal" role="dialog" aria-modal="true" aria-label="Task details">
        <TaskModalHeader
          task={draftTask}
          columns={columns}
          assignees={assignees}
          isDirty={isDirty}
          onUpdateTask={updateDraft}
          onSave={saveDraft}
          onSaveAndClose={saveAndClose}
          onToggleComments={() => {
            document.getElementById('task-discussion-heading')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }}
          onClose={requestClose}
          onExpand={() => setIsExpanded((expanded) => !expanded)}
          isExpanded={isExpanded}
        />
        <TaskModalTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === 'details' ? (
          <div
            id="task-details-panel"
            className="task-modal__content-grid"
            role="tabpanel"
            aria-labelledby="task-details-tab"
          >
            <TaskModalLeftColumn
              task={draftTask}
              assignees={assignees}
              onUpdateTask={updateDraft}
              onReserveTaskNumber={onReserveTaskNumber}
            />
            <TaskModalRightColumn
              task={draftTask}
              assignees={assignees}
              columns={columns}
              onUpdateTask={updateDraft}
              onRemoveTaskRelation={onRemoveTaskRelation}
            />
          </div>
        ) : (
          <div
            id="task-history-panel"
            className="task-modal__empty-history-panel"
            role="tabpanel"
            aria-labelledby="task-history-tab"
          />
        )}
        <ConfirmDialog
          isOpen={isDiscardConfirmOpen}
          title="Unsaved changes"
          message="Discard your unsaved changes?"
          confirmText="Discard changes"
          cancelText="Keep editing"
          onConfirm={() => {
            setIsDiscardConfirmOpen(false);
            onClose();
          }}
          onCancel={() => setIsDiscardConfirmOpen(false)}
        />
      </section>
    </div>
  );
}
