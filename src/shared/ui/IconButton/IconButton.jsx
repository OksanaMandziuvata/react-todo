import './IconButton.scss';

export default function IconButton({
  children,
  onClick,
  className = '',
  ariaLabel,
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`.trim()}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
