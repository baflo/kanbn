import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
function removeTask(taskId, removeFile) {
  kanbn.deleteTask(taskId, removeFile).then((taskId2) => {
    console.log(`Removed task "${taskId2}"${removeFile ? " from the index" : " file and index entry"}`);
  }).catch((error) => {
    utility.error(error);
  });
}
var remove_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn remove "task id"{b}');
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
  if (args.force) {
    removeTask(taskId, args.index);
  } else {
    inquirer.prompt([
      {
        type: "confirm",
        message: "Are you sure you want to remove this task?",
        name: "sure",
        default: false
      }
    ]).then(async (answers) => {
      if (answers.sure) {
        removeTask(taskId, args.index);
      }
    }).catch((error) => {
      utility.error(error);
    });
  }
};
export {
  remove_default as default
};
