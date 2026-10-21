import './IconButton.scss';

export default function IconButton({
  children,
  onClick,
  className = '',
  ariaLabel,
  disabled = false
}) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`.trim()}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
