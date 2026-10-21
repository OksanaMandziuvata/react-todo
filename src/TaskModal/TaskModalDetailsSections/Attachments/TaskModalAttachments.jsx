import { useRef, useState } from 'react';
import IconButton from '@/shared/ui/IconButton';
import { CloseIcon } from '@/shared/ui/icons';
import SectionHeader from '../shared/SectionHeader';
import './TaskModalAttachments.scss';

const MAX_ATTACHMENT_SIZE = 1024 * 1024;

export default function TaskModalAttachments({ attachments, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');

  const handleUpload = (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (file.size > MAX_ATTACHMENT_SIZE) {
      setError('Attachments must be 1 MB or smaller.');
      event.target.value = '';
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        console.error('Could not read the selected attachment.');
        setError('Could not read this attachment.');
        return;
      }
      onChange([
        ...attachments,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          size: file.size,
          dataUrl: reader.result,
        },
      ]);
    };
    reader.onerror = () => {
      console.error('Could not read the selected attachment.', reader.error);
      setError('Could not read this attachment.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <section className="task-modal-section task-modal-attachments" aria-labelledby="task-attachments-heading">
      <SectionHeader
        title="Attachments"
        id="task-attachments-heading"
        action="Upload"
        onAction={() => inputRef.current?.click()}
      />
      <input ref={inputRef} type="file" hidden onChange={handleUpload} />
      {attachments.length > 0 ? (
        <ul className="task-modal-attachments__list">
          {attachments.map((attachment) => (
            <li key={attachment.id}>
              {attachment.dataUrl ? (
                <a href={attachment.dataUrl} download={attachment.name}>{attachment.name}</a>
              ) : <span>{attachment.name}</span>}
              <small>{attachment.size ? `${Math.max(1, Math.round(attachment.size / 1024))} KB` : ''}</small>
              <IconButton
                className="task-modal-attachments__remove"
                aria-label={`Remove attachment ${attachment.name}`}
                onClick={() => onChange(attachments.filter((item) => item.id !== attachment.id))}
              >
                <img src={CloseIcon} alt="" />
              </IconButton>
            </li>
          ))}
        </ul>
      ) : (
        <p className="task-modal-section__empty">No attachments yet.</p>
      )}
      {error && <p className="task-modal-section__error" role="alert">{error}</p>}
    </section>
  );
}
