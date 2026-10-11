import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
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
        <IconButton className="clear-selection" onClick={onClearSelection} ariaLabel="Clear selected">
          ✕
        </IconButton>
      </div>
      <div className="bulk-buttons">
        <Button className="btn-success-text" onClick={onBulkMarkComplete}>Mark complete</Button>
        <Button onClick={onBulkMarkIncomplete}>Mark incomplete</Button>
        
        <select className="bulk-move-select" onChange={onBulkMove} defaultValue="">
          <option value="" disabled>Move to...</option>
          {columns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
        
        <Button className="btn-danger-text" onClick={onBulkDelete}>Delete</Button>
      </div>
    </div>
  );
}