import './IconButton.scss';

export default function IconButton({ className = '', type = 'button', children, ...props }) {
  return (
    <button type={type} className={`icon-button ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
