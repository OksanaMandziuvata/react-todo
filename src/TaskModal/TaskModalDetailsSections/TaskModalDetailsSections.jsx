import AcceptanceCriteria from './AcceptanceCriteria/AcceptanceCriteria';
import Subtasks from './Subtasks/Subtasks';
import './TaskModalDetailsSections.scss';

export { default as TaskModalAttachments } from './Attachments/TaskModalAttachments';
export { default as TaskModalPeople } from './People/TaskModalPeople';
export { default as TaskModalRelatedWork } from './RelatedWork/TaskModalRelatedWork';

export default function TaskModalDetailsSections({
  task,
  assignees,
  onUpdateTask,
  onReserveTaskNumber,
}) {
  return (
    <>
      <AcceptanceCriteria
        items={task.acceptanceCriteria || []}
        onChange={(acceptanceCriteria) => onUpdateTask({ acceptanceCriteria })}
      />
      <Subtasks
        items={task.subtasks || []}
        assignees={assignees}
        onChange={(subtasks) => onUpdateTask({ subtasks })}
        onReserveTaskNumber={onReserveTaskNumber}
      />
    </>
  );
}
