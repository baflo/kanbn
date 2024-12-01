import kanbn from "../main.js";
import utility from "../utility.js";
import board from "../board.js";
var board_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
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
  const tasks = (await kanbn.loadAllTrackedTasks(index)).map(
    (task) => kanbn.hydrateTask(index, task)
  );
  board.show(index, tasks, args.view, args.json).catch((error) => {
    utility.error(error);
  });
};
export {
  board_default as default
};
