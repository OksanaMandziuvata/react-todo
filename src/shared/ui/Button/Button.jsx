import './Button.scss';

export default function Button({ className = '', type = 'button', children, ...props }) {
  return (
    <button type={type} className={`ui-button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
