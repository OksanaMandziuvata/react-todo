import Button from '@/shared/ui/Button';
import SearchInput from '@/shared/ui/SearchInput';
import SegmentedControl from '@/shared/ui/SegmentedControl';
import { GridIcon } from '@/shared/ui/icons';
import { FILTER_TYPES } from '@/features/board/constants';
import { useNavigate } from 'react-router-dom';
import './Navbar.scss';

export default function Navbar({ globalSearch, setGlobalSearch, filterType, setFilterType, onOpenModal }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-logo">
          <img src={GridIcon} width="22" height="22" alt="" />
          <h2>TrelloAlt</h2>
        </div>
        
        <SearchInput
          inputClassName="global-search-input"
          placeholder="Search tasks..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
        />

        <SegmentedControl
          className="toolbar-filters"
          value={filterType}
          onChange={setFilterType}
          options={[
            { label: 'All', value: FILTER_TYPES.ALL },
            { label: 'Incomplete', value: FILTER_TYPES.INCOMPLETE },
            { label: 'Completed', value: FILTER_TYPES.COMPLETED }
          ]}
        />
      </div>
      <div className="toolbar-actions">
        <Button variant="secondary" onClick={handleLogout}>Log out</Button>
        <Button variant="primary" onClick={onOpenModal}>+ Add Column</Button>
      </div>
    </div>
  );
}