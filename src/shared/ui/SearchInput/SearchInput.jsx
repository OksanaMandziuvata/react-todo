import { SearchIcon } from '@/shared/ui/icons';
import './SearchInput.scss';

export default function SearchInput({ className = '', inputClassName = '', ...props }) {
  return (
    <div className={`search-input ${className}`.trim()}>
      <span className="search-input-icon" aria-hidden="true">
        <img src={SearchIcon} width="16" height="16" alt="" />
      </span>
      <input
        type="text"
        className={`search-input-field ${inputClassName}`.trim()}
        {...props}
      />
    </div>
  );
}
