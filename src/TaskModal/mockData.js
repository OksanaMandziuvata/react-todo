export const MOCK_TEAM_MEMBERS = [
  'Olena Kovalenko',
  'Andrii Melnyk',
  'Dmytro Shevchenko',
];

export const TEAM_MEMBERS_STORAGE_KEY = 'trelloAlt.board.people';

export function loadTeamMembers() {
  try {
    const storedMembers = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    if (storedMembers === null) {
      return { members: MOCK_TEAM_MEMBERS, error: '', shouldSeed: true };
    }

    const members = JSON.parse(storedMembers);
    if (!Array.isArray(members) || members.some((member) => typeof member !== 'string' || !member.trim())) {
      throw new Error('Saved team members have an invalid structure.');
    }
    return { members: [...new Set(members)], error: '', shouldSeed: false };
  } catch (error) {
    console.error('Could not load team members from local storage.', error);
    return {
      members: MOCK_TEAM_MEMBERS,
      error: 'Saved team members could not be loaded. The default mock team is being used.',
      shouldSeed: false,
    };
  }
}

const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

function createMockDiscussion() {
  return [
    {
      id: `mock-comment-${Date.now()}-olena`,
      author: 'Olena Kovalenko',
      text: 'Checked on Safari and Firefox — animation is smooth. Moving on to saving the new order next.',
      createdAt: hoursAgo(1),
      replies: [],
      reactions: [],
    },
    {
      id: `mock-comment-${Date.now()}-andrii`,
      author: 'Andrii Melnyk',
      text: '@Olena Kovalenko the drop placeholder component is merged. Can you check the animation on Safari?',
      createdAt: hoursAgo(2),
      replies: [],
      reactions: [],
    },
    {
      id: `mock-comment-${Date.now()}-dmytro`,
      author: 'Dmytro Shevchenko',
      text: 'I added the acceptance criteria and assigned the follow-up tasks.',
      createdAt: hoursAgo(24),
      replies: [],
      reactions: [],
    },
    {
      id: `mock-comment-${Date.now()}-olena-earlier`,
      author: 'Olena Kovalenko',
      text: 'The keyboard interaction feels good too. I will test it on touch devices.',
      createdAt: hoursAgo(48),
      replies: [],
      reactions: [],
    },
  ];
}

export function addMockTaskPeople(task) {
  return {
    ...task,
    createdAt: task.createdAt ?? hoursAgo(12 * 24),
    updatedAt: task.updatedAt ?? hoursAgo(1),
    reviewer: task.reviewer ?? 'Andrii Melnyk',
    createdBy: task.createdBy ?? 'Dmytro Shevchenko',
    watchers: task.watchers ?? ['Olena Kovalenko', 'Andrii Melnyk'],
    comments: task.comments === undefined ? createMockDiscussion() : task.comments,
  };
}
