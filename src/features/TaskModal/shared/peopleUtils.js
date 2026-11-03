export function initials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function personAvatarClass(name) {
  const member = {
    'Olena Kovalenko': 'olena',
    'Andrii Melnyk': 'andrii',
    'Dmytro Shevchenko': 'dmytro',
  }[name] || 'default';
  return `task-modal-people__avatar task-modal-people__avatar--${member}`;
}
