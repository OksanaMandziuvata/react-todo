import Button from '@/shared/ui/Button';
import './TaskModalTabs.scss';

export default function TaskModalTabs({ activeTab, history, onChange }) {
  return (
    <div className="task-modal-tabs" role="tablist" aria-label="Task detail sections">
      <Button
        id="task-details-tab"
        className={`task-modal-tabs__tab${activeTab === 'details' ? ' is-active' : ''}`}
        role="tab"
        aria-selected={activeTab === 'details'}
        aria-controls="task-details-panel"
        onClick={() => onChange('details')}
      >
        Details
      </Button>
      <Button
        id="task-history-tab"
        className={`task-modal-tabs__tab${activeTab === 'history' ? ' is-active' : ''}`}
        role="tab"
        aria-selected={activeTab === 'history'}
        aria-controls="task-history-panel"
        onClick={() => onChange('history')}
      >
        <span>History</span>
        <span className="task-modal-tabs__count">{history.length}</span>
      </Button>
    </div>
  );
}
