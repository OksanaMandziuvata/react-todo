export const BOARD_STORAGE_KEY = 'trelloAlt.board.columns';
const TASK_NUMBER_COUNTER_KEY = 'trelloAlt.board.nextTaskNumber';

function isValidTaskNumber(number) {
  return Number.isSafeInteger(number) && number > 0;
}

function highestTaskNumber(columns) {
  return columns.reduce((highest, column) => column.todos.reduce((columnHighest, todo) => {
    const taskNumber = Number(todo.number);
    const subtaskNumber = (Array.isArray(todo.subtasks) ? todo.subtasks : [])
      .reduce((subtaskHighest, subtask) => {
      const number = Number(subtask.number);
      return isValidTaskNumber(number) ? Math.max(subtaskHighest, number) : subtaskHighest;
    }, columnHighest);
    return isValidTaskNumber(taskNumber)
      ? Math.max(subtaskNumber, taskNumber)
      : subtaskNumber;
  }, highest), 0);
}

function readNextTaskNumber() {
  const storedNextNumber = Number(localStorage.getItem(TASK_NUMBER_COUNTER_KEY));
  return isValidTaskNumber(storedNextNumber) ? storedNextNumber : 1;
}

export function normalizeTaskNumbers(columns) {
  const savedNextNumber = readNextTaskNumber();
  let nextNumber = Math.max(savedNextNumber, highestTaskNumber(columns) + 1);
  const usedNumbers = new Set();

  const normalizedColumns = columns.map((column) => ({
    ...column,
    todos: column.todos.map((todo) => {
      let number = Number(todo.number);
      if (!isValidTaskNumber(number) || usedNumbers.has(number)) {
        number = nextNumber;
        nextNumber += 1;
      }
      usedNumbers.add(number);

      const existingSubtasks = todo.subtasks || [];
      const mappedSubtasks = existingSubtasks.map((subtask) => {
        let subtaskNumber = Number(subtask.number);
        if (!isValidTaskNumber(subtaskNumber) || usedNumbers.has(subtaskNumber)) {
          subtaskNumber = nextNumber;
          nextNumber += 1;
        }
        usedNumbers.add(subtaskNumber);
        return subtask.number === subtaskNumber ? subtask : { ...subtask, number: subtaskNumber };
      });
      const subtasks = mappedSubtasks.some((subtask, index) => subtask !== existingSubtasks[index])
        ? mappedSubtasks
        : todo.subtasks;

      return todo.number === number && todo.subtasks === subtasks
        ? todo
        : { ...todo, number, ...(todo.subtasks ? { subtasks } : {}) };
    }),
  }));

  return {
    columns: normalizedColumns,
    nextNumber,
    changed: normalizedColumns.some((column, columnIndex) => (
      column.todos.some((todo, todoIndex) => todo !== columns[columnIndex].todos[todoIndex])
    )),
  };
}

export function reserveNextTaskNumber(columns) {
  const storedBoard = localStorage.getItem(BOARD_STORAGE_KEY);
  const persistedColumns = storedBoard ? JSON.parse(storedBoard) : [];
  if (!Array.isArray(persistedColumns) || persistedColumns.some((column) => (
    !column || !Array.isArray(column.todos) || column.todos.some((todo) => (
      !todo || (todo.subtasks != null && !Array.isArray(todo.subtasks))
    ))
  ))) {
    throw new Error('Saved board data has an invalid structure.');
  }

  const nextNumber = Math.max(
    readNextTaskNumber(),
    highestTaskNumber(columns) + 1,
    highestTaskNumber(persistedColumns) + 1
  );
  localStorage.setItem(TASK_NUMBER_COUNTER_KEY, String(nextNumber + 1));
  return nextNumber;
}

export function persistNextTaskNumber(columns, minimumNextNumber = 1) {
  const nextNumber = Math.max(readNextTaskNumber(), highestTaskNumber(columns) + 1, minimumNextNumber);
  localStorage.setItem(TASK_NUMBER_COUNTER_KEY, String(nextNumber));
}
