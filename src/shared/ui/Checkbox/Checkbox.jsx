import './Checkbox.scss';

export default function Checkbox({ className = '', type = 'checkbox', ...props }) {
  return (
    <input
      type={type}
      className={`ui-checkbox ${className}`.trim()}
      {...props}
    />
  );
}
