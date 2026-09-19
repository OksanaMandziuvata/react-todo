import GridIcon from './assets/GridIcon';
import SearchIcon from './assets/SearchIcon';

export default function Navbar({ globalSearch, setGlobalSearch, filterType, setFilterType, onOpenModal }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-logo">
          <GridIcon size={22} color="#818CF8" />
          <h2>TrelloAlt</h2>
        </div>
        
        <div className="search-wrapper">
          <span className="search-custom-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <button className={`filter-btn ${filterType === 'All' ? 'active' : ''}`} onClick={() => setFilterType('All')}>All</button>
            <button className={`filter-btn ${filterType === 'Incomplete' ? 'active' : ''}`} onClick={() => setFilterType('Incomplete')}>Incomplete</button>
            <button className={`filter-btn ${filterType === 'Completed' ? 'active' : ''}`} onClick={() => setFilterType('Completed')}>Completed</button>
        </div>
      </div>
      <div className="toolbar-actions">
        <button className="btn-primary" onClick={onOpenModal}>+ Add Column</button>
      </div>
    </div>
  );
}