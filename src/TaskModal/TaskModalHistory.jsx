import './TaskModalHistory.scss';

export default function TaskModalHistory({ history }) {
  return (
    <div
      id="task-history-panel"
      className="task-modal__history"
      role="tabpanel"
      aria-labelledby="task-history-tab"
    >
      {history.length ? (
        <ol>
          {[...history].reverse().map((entry) => (
            <li key={entry.id}>
              <span>{entry.action}</span>
              <time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleString()}</time>
            </li>
          ))}
        </ol>
      ) : (
        <p>No task history yet. Saved changes will appear here.</p>
      )}
    </div>
  );
}
