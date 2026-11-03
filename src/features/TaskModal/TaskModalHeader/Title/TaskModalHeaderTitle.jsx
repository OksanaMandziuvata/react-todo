import './TaskModalHeaderTitle.scss';

export default function TaskModalHeaderTitle({ task, onUpdateTask }) {
  return (
    <input
      className="task-modal-header__title"
      aria-label="Task title"
      value={task.title ?? task.text ?? ''}
      onChange={(event) => {
        const text = event.target.value;
        onUpdateTask({
          text,
          ...(Object.hasOwn(task, 'title') ? { title: text } : {}),
        });
      }}
    />
  );
}
