import Button from '@/shared/ui/Button';
import { PlusIcon } from '@/shared/ui/icons';

export default function SectionHeader({ title, id, meta, action, onAction }) {
  return (
    <header className="task-modal-section__header">
      <h2 id={id}>{title}</h2>
      {meta}
      {action && (
        <Button type="button" className="task-modal-section__action" onClick={onAction}>
          <img src={PlusIcon} alt="" />
          {action}
        </Button>
      )}
    </header>
  );
}
