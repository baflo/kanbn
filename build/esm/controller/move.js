import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
import inquirerSelectLine from "inquirer-select-line";
inquirer.registerPrompt("selectLine", inquirerSelectLine);
async function interactive(columns, columnName, columnNames, sortedColumnNames, taskId, position) {
  return await inquirer.prompt([
    {
      type: "list",
      name: "column",
      message: "Column:",
      default: columnName,
      choices: columnNames
    },
    {
      type: "selectLine",
      name: "position",
      message: "Move task:",
      default: (answers) => Math.max(Math.min(position, columns[answers.column].length), 0),
      choices: (answers) => columns[answers.column].filter((t) => t !== taskId),
      placeholder: taskId,
      when: (answers) => sortedColumnNames.indexOf(answers.column) === -1
    }
  ]);
}
function moveTask(taskId, columnName, position = null, relative = false) {
  kanbn.moveTask(taskId, columnName, position, relative).then((taskId2) => {
    console.log(`Moved task "${taskId2}" to column "${columnName}"`);
  }).catch((error) => {
    utility.error(error);
  });
}
var move_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn move "task id"{b}');
    return;
  }
  try {
    await kanbn.taskExists(taskId);
  } catch (error) {
    utility.error(error);
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
  const currentColumnName = await kanbn.findTaskColumn(taskId);
  let columnName = currentColumnName;
  if (args.column) {
    columnName = utility.strArg(args.column);
    if (columnNames.indexOf(columnName) === -1) {
      utility.error(`Column "${columnName}" doesn't exist`);
      return;
    }
  }
  const currentPosition = index.columns[currentColumnName].indexOf(taskId);
  let newPosition = args.position || args.p;
  if (newPosition) {
    newPosition = parseInt(utility.trimLeftEscapeCharacters(newPosition));
    if (isNaN(newPosition)) {
      utility.error("Position value must be numeric");
      return;
    }
  } else {
    newPosition = null;
  }
  const sortedColumnNames = "columnSorting" in index.options ? Object.keys(index.options.columnSorting) : [];
  if (args.interactive) {
    interactive(
      index.columns,
      columnName,
      columnNames,
      sortedColumnNames,
      taskId,
      newPosition === null ? currentPosition : args.relative ? currentPosition + newPosition : newPosition
    ).then((answers) => {
      moveTask(taskId, answers.column, answers.position);
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    moveTask(taskId, columnName, newPosition, args.relative);
  }
};
export {
  move_default as default
};
