import { Children, isValidElement, useEffect, useId, useRef, useState } from 'react';
import ChevronDownIcon from '@/shared/ui/icons/ChevronDownIcon.svg';
import './Dropdown.scss';

export default function Dropdown({
  children,
  className = '',
  showChevron = true,
  style,
  onChange,
  value,
  ...props
}) {
  const rootRef = useRef(null);
  const dropdownId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState(null);
  const options = Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === 'option')
    .map((option) => ({
      value: String(option.props.value ?? option.props.children),
      label: option.props.children,
      disabled: Boolean(option.props.disabled),
    }));
  const selectedIndex = options.findIndex((option) => option.value === String(value ?? ''));
  const selectedOption = options[selectedIndex];

  const closeMenu = () => {
    setIsOpen(false);
    setMenuPosition(null);
  };

  const openMenu = (index = selectedIndex >= 0 ? selectedIndex : 0) => {
    const trigger = rootRef.current?.querySelector('.ui-dropdown__trigger');
    if (!trigger) return;
    const bounds = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - bounds.bottom;
    const spaceAbove = bounds.top;
    const opensUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    const width = Math.min(Math.max(bounds.width, 180), window.innerWidth - 16);

    setMenuPosition({
      left: Math.min(bounds.left, window.innerWidth - width - 8),
      width,
      ...(opensUp
        ? { bottom: window.innerHeight - bounds.top + 4 }
        : { top: bounds.bottom + 4 }),
    });
    setActiveIndex(index);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) closeMenu();
    };
    const handleViewportChange = () => closeMenu();

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isOpen]);

  const selectOption = (option) => {
    if (option.disabled) return;
    onChange?.({ target: { value: option.value } });
    closeMenu();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      if (!isOpen) {
        openMenu(direction === 1 ? selectedIndex : selectedIndex < 0 ? options.length - 1 : selectedIndex);
        return;
      }

      let nextIndex = activeIndex;
      for (let attempt = 0; attempt < options.length; attempt += 1) {
        nextIndex = (nextIndex + direction + options.length) % options.length;
        if (!options[nextIndex].disabled) break;
      }
      setActiveIndex(nextIndex);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isOpen && options[activeIndex]) selectOption(options[activeIndex]);
      else openMenu();
      return;
    }

    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeMenu();
    }

    if (event.key === 'Tab') closeMenu();
  };

  return (
    <div ref={rootRef} className={`ui-dropdown ${className}`.trim()} style={style}>
      <button
        {...props}
        type="button"
        role="combobox"
        className={`ui-dropdown__trigger${showChevron ? '' : ' ui-dropdown__trigger--no-chevron'}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-autocomplete="none"
        aria-controls={isOpen ? `${dropdownId}-listbox` : undefined}
        aria-activedescendant={isOpen ? `${dropdownId}-option-${activeIndex}` : undefined}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className="ui-dropdown__value">{selectedOption?.label ?? options[0]?.label}</span>
        {showChevron && <img className="ui-dropdown__chevron" src={ChevronDownIcon} alt="" />}
      </button>
      {isOpen && menuPosition && (
        <div
          className="ui-dropdown__menu"
          id={`${dropdownId}-listbox`}
          role="listbox"
          style={menuPosition}
        >
          {options.map((option, index) => (
            <div
              id={`${dropdownId}-option-${index}`}
              key={`${option.value}-${index}`}
              className={[
                'ui-dropdown__option',
                index === selectedIndex ? 'is-selected' : '',
                index === activeIndex ? 'is-active' : '',
                option.disabled ? 'is-disabled' : '',
              ].filter(Boolean).join(' ')}
              role="option"
              aria-selected={index === selectedIndex}
              aria-disabled={option.disabled || undefined}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => selectOption(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
