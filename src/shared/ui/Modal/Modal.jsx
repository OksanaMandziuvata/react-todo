import './Modal.scss';

export default function Modal({ title, children, footer }) {
  return (
    <div className="modal-overlay">
      <section className="modal-content" role="dialog" aria-modal="true" aria-label={title}>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}
