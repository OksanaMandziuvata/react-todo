import { useEffect, useRef, useState } from 'react';
import Button from '@/shared/ui/Button';
import IconButton from '@/shared/ui/IconButton';
import { AttachmentIcon, CloseIcon, CodeIcon, LinkIcon, ListIcon } from '@/shared/ui/icons';
import './TaskModalDescription.scss';

const MAX_ATTACHMENT_SIZE = 1024 * 1024;
const ALLOWED_TAGS = new Set(['A', 'B', 'BR', 'CODE', 'DIV', 'EM', 'I', 'LI', 'OL', 'P', 'PRE', 'STRONG', 'U', 'UL']);

function sanitizeHtml(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const cleanNode = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        if (!ALLOWED_TAGS.has(child.tagName)) {
          child.replaceWith(...child.childNodes);
          return;
        }
        [...child.attributes].forEach((attribute) => {
          if (child.tagName !== 'A' || attribute.name !== 'href') child.removeAttribute(attribute.name);
        });
        if (child.tagName === 'A') {
          const url = child.getAttribute('href');
          if (url && !/^https?:\/\//i.test(url) && !url.startsWith('mailto:')) {
            child.removeAttribute('href');
          }
        }
        cleanNode(child);
      } else if (child.nodeType !== Node.TEXT_NODE) {
        child.remove();
      }
    });
  };

  cleanNode(parsed.body);
  return parsed.body.innerHTML;
}

export default function TaskModalDescription({
  description,
  attachments,
  onDescriptionChange,
  onAttachmentsChange,
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const linkSelectionRef = useRef(null);
  const [attachmentError, setAttachmentError] = useState('');
  const [isLinkEntryOpen, setIsLinkEntryOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkError, setLinkError] = useState('');

  useEffect(() => {
    const editor = editorRef.current;
    const safeDescription = sanitizeHtml(description);
    if (editor && editor.innerHTML !== safeDescription) editor.innerHTML = safeDescription;
  }, [description]);

  const formatText = (command, value) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onDescriptionChange(sanitizeHtml(editorRef.current?.innerHTML || ''));
  };

  const preserveLinkSelection = (event) => {
    event.preventDefault();
    const selection = window.getSelection();
    linkSelectionRef.current = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
  };

  const insertLink = (event) => {
    event.preventDefault();
    const safeUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(safeUrl) && !safeUrl.startsWith('mailto:')) {
      setLinkError('Enter a valid http, https, or mailto URL.');
      return;
    }

    editorRef.current?.focus();
    const selection = window.getSelection();
    if (selection && linkSelectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(linkSelectionRef.current);
    }
    document.execCommand('createLink', false, safeUrl);
    onDescriptionChange(sanitizeHtml(editorRef.current?.innerHTML || ''));
    linkSelectionRef.current = null;
    setIsLinkEntryOpen(false);
    setLinkUrl('');
    setLinkError('');
  };

  const addAttachment = (event) => {
    const [file] = event.target.files || [];
    if (!file) return;
    if (file.size > MAX_ATTACHMENT_SIZE) {
      setAttachmentError('Attachments must be 1 MB or smaller.');
      event.target.value = '';
      return;
    }

    setAttachmentError('');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        console.error('Could not read the selected attachment.');
        setAttachmentError('Could not read this attachment.');
        return;
      }
      onAttachmentsChange([
        ...attachments,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: file.name, dataUrl: reader.result },
      ]);
    };
    reader.onerror = () => {
      console.error('Could not read the selected attachment.', reader.error);
      setAttachmentError('Could not read this attachment.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  return (
    <section className="task-modal-description" aria-labelledby="task-description-heading">
      <header className="task-modal-description__header">
        <h2 id="task-description-heading">Description</h2>
        <span>Rich text</span>
      </header>

      <div className="task-modal-description__editor">
        <div className="task-modal-description__toolbar" role="toolbar" aria-label="Description formatting">
          <IconButton className="task-modal-description__tool" ariaLabel="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('bold')}>
            <strong>B</strong>
          </IconButton>
          <IconButton className="task-modal-description__tool" ariaLabel="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('italic')}>
            <em>I</em>
          </IconButton>
          <IconButton className="task-modal-description__tool" ariaLabel="Underline" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('underline')}>
            <u>U</u>
          </IconButton>
          <span className="task-modal-description__divider" aria-hidden="true" />
          <IconButton className="task-modal-description__tool" ariaLabel="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('insertUnorderedList')}>
            <img src={ListIcon} alt="" />
          </IconButton>
          <IconButton className="task-modal-description__tool" ariaLabel="Code block" onMouseDown={(event) => event.preventDefault()} onClick={() => formatText('formatBlock', 'pre')}>
            <img src={CodeIcon} alt="" />
          </IconButton>
          <IconButton
            className="task-modal-description__tool"
            ariaLabel="Insert link"
            aria-expanded={isLinkEntryOpen}
            onMouseDown={preserveLinkSelection}
            onClick={() => {
              setIsLinkEntryOpen((open) => !open);
              setLinkError('');
            }}
          >
            <img src={LinkIcon} alt="" />
          </IconButton>
          <IconButton className="task-modal-description__tool" ariaLabel="Attach file" onMouseDown={(event) => event.preventDefault()} onClick={() => fileInputRef.current?.click()}>
            <img src={AttachmentIcon} alt="" />
          </IconButton>
          <input ref={fileInputRef} type="file" hidden onChange={addAttachment} />
          {isLinkEntryOpen && (
            <form
              className="task-modal-description__link-form"
              onSubmit={insertLink}
            >
              <input
                autoFocus
                aria-label="Link URL"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setIsLinkEntryOpen(false);
                    setLinkUrl('');
                    setLinkError('');
                  }
                }}
              />
              <Button type="submit" variant="primary">Insert</Button>
              {linkError && <span role="alert">{linkError}</span>}
            </form>
          )}
        </div>

        <div className="task-modal-description__content">
          <div
            ref={editorRef}
            className="task-modal-description__editable"
            contentEditable
            suppressContentEditableWarning
            role="textbox"
            aria-label="Task description"
            aria-multiline="true"
            data-placeholder="Add a description..."
            onInput={(event) => onDescriptionChange(sanitizeHtml(event.currentTarget.innerHTML))}
            onPaste={(event) => {
              event.preventDefault();
              const text = event.clipboardData.getData('text/plain');
              document.execCommand('insertText', false, text);
            }}
          />
          {attachments.length > 0 && (
            <ul className="task-modal-description__attachments" aria-label="Attachments">
              {attachments.map((attachment) => (
                <li key={attachment.id}>
                  <a href={attachment.dataUrl} download={attachment.name}>{attachment.name}</a>
                  <IconButton
                    className="task-modal-description__remove-attachment"
                    ariaLabel={`Remove ${attachment.name}`}
                    onClick={() => onAttachmentsChange(attachments.filter((item) => item.id !== attachment.id))}
                  >
                    <img src={CloseIcon} alt="" />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
          {attachmentError && <p className="task-modal-description__error" role="alert">{attachmentError}</p>}
        </div>
      </div>
    </section>
  );
}
