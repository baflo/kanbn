import kanbn_module from '../main.js';
const kanbn = new kanbn_module.Kanbn();
import utility from '../utility.js';
import board from '../board.js';

export default async args => {

  // Make sure kanbn has been initialised
  if (!await kanbn.initialised()) {
    utility.error('Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}');
    return;
  }

  // Get the index and make sure it has some columns
  let index;
  try {
    index = await kanbn.getIndex();
  } catch (error) {
    utility.error(error);
    return;
  }
  const columnNames = Object.keys(index.columns);
  if (!columnNames.length) {
    utility.error('No columns defined in the index\nTry running {b}kanbn init -c "column name"{b}');
    return;
  }

  // Load and hydrate all tracked tasks
  const tasks = (await kanbn.loadAllTrackedTasks(index)).map(
    task => kanbn.hydrateTask(index, task)
  );

  // Show the board
  board
  .show(index, tasks, args.view, args.json)
  .catch(error => {
    utility.error(error);
  });
};
