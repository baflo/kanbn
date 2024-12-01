import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
async function interactive(taskData) {
  return await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Task name:",
      default: taskData.name || "",
      validate: async (value) => {
        if (!value) {
          return "Task name cannot be empty";
        }
        return true;
      }
    }
  ]);
}
function renameTask(taskId, newTaskName, currentTaskName) {
  if (newTaskName === currentTaskName) {
    utility.error(`Task "${taskId}" already has the name "${newTaskName}"`);
    return;
  }
  kanbn.renameTask(taskId, newTaskName).then((newTaskId) => {
    console.log(`Renamed task "${taskId}" to "${newTaskId}"`);
  }).catch((error) => {
    utility.error(error);
  });
}
var rename_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn rename "task id"{b}');
    return;
  }
  try {
    await kanbn.taskExists(taskId);
  } catch (error) {
    utility.error(error);
    return;
  }
  let taskData;
  try {
    taskData = await kanbn.getTask(taskId);
  } catch (error) {
    utility.error(error);
    return;
  }
  const currentTaskName = taskData.name;
  if (args.name) {
    taskData.name = utility.strArg(args.name);
  }
  if (args.interactive) {
    interactive(taskData).then((answers) => {
      renameTask(taskId, answers.name, currentTaskName);
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    renameTask(taskId, taskData.name, currentTaskName);
  }
};
export {
  rename_default as default
};
