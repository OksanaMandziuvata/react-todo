import './Button.scss';

export default function Button({
  children,
  onClick,
  className = '',
  type = 'button',
  variant = 'default',
  disabled = false,
  ...props
}) {
  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
