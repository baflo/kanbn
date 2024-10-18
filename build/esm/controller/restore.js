import kanbn from "../main.js";
import utility from "../utility.js";
function restoreTask(taskId, columnName) {
  kanbn.restoreTask(taskId, columnName).then((taskId2) => {
    console.log(`Restored task "${taskId2}" from the archive`);
  }).catch((error) => {
    utility.error(error);
  });
}
var restore_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn restore "task id"{b}');
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
  let columnName = null;
  if (args.column) {
    columnName = utility.strArg(args.column);
    if (columnNames.indexOf(columnName) === -1) {
      utility.error(`Column "${columnName}" doesn't exist`);
      return;
    }
  }
  restoreTask(taskId, columnName);
};
export {
  restore_default as default
};
