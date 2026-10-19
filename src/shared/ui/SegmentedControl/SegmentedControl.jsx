import './SegmentedControl.scss';

export default function SegmentedControl({ options, value, onChange, className = '' }) {
  return (
    <div className={`segmented-control ${className}`.trim()} role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented-control-option ${value === option.value ? 'active' : ''}`}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
