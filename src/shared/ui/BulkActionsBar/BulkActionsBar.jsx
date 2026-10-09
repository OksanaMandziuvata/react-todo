import './BulkActionsBar.scss';

export default function BulkActionsBar({ 
  selectedCount, 
  onClearSelection, 
  onBulkMarkComplete, 
  onBulkMarkIncomplete, 
  onBulkMove, 
  onBulkDelete, 
  columns 
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-action-bar">
      <div className="selected-count">
        <span className="count-badge">{selectedCount} selected</span>
        <button className="clear-selection" onClick={onClearSelection}>✕</button>
      </div>
      <div className="bulk-buttons">
        <button className="btn-success-text" onClick={onBulkMarkComplete}>Mark complete</button>
        <button onClick={onBulkMarkIncomplete}>Mark incomplete</button>
        
        <select className="bulk-move-select" onChange={onBulkMove} defaultValue="">
          <option value="" disabled>Move to...</option>
          {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        
        <button className="btn-danger-text" onClick={onBulkDelete}>Delete</button>
      </div>
    </div>
  );
}