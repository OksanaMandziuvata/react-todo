import GridIcon from './assets/GridIcon';
import SearchIcon from './assets/SearchIcon';
import { FILTER_TYPES } from './constants';

export default function Navbar({ globalSearch, setGlobalSearch, filterType, setFilterType, onOpenModal }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-logo">
          <GridIcon size={22} color="#818CF8" />
          <h2>TrelloAlt</h2>
        </div>
        
        <div className="search-wrapper">
          <span className="search-custom-icon">
            <SearchIcon size={16} color="#64748B" />
          </span>
          
          <input 
            className="global-search-input" 
            placeholder="Search tasks..." 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
            <button className={`filter-btn ${filterType === FILTER_TYPES.ALL ? 'active' : ''}`} onClick={() => setFilterType(FILTER_TYPES.ALL)}>All</button>
            <button className={`filter-btn ${filterType === FILTER_TYPES.INCOMPLETE ? 'active' : ''}`} onClick={() => setFilterType(FILTER_TYPES.INCOMPLETE)}>Incomplete</button>
            <button className={`filter-btn ${filterType === FILTER_TYPES.COMPLETED ? 'active' : ''}`} onClick={() => setFilterType(FILTER_TYPES.COMPLETED)}>Completed</button>
        </div>
      </div>
      <div className="toolbar-actions">
        <button className="btn-primary" onClick={onOpenModal}>+ Add Column</button>
      </div>
    </div>
  );
}