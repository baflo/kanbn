const kanbn = require('../lib/main');
const utility = require('../lib/utility');
const inquirer = require('inquirer');

/**
 * Rename a task interactively
 * @param {object} taskData
 */
async function interactive(taskData) {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Task name:',
      default: taskData.name || '',
      validate: async function (value) {
        if ((/.+/).test(value)) {
          return true;
        }
        return 'Task name cannot be empty';
      }
    }
  ]);
}

/**
 * Rename a task
 * @param {string} taskId
 * @param {string} newTaskName
 * @param {string} currentTaskName
 */
function renameTask(taskId, newTaskName, currentTaskName) {

  // Check if the new name is the same as the current name
  if (newTaskName === currentTaskName) {
    console.log(`Task "${taskId}" already has the name "${newTaskName}"`);
    return;
  }

  // New name is different to current name, so rename the task
  kanbn
  .renameTask(taskId, newTaskName)
  .then(newTaskId => {
    console.log(`Renamed task "${taskId}" to "${newTaskId}"`);
  })
  .catch(error => {
    utility.showError(error);
  });
}

module.exports = async args => {

  // Make sure kanbn has been initialised
  if (!await kanbn.initialised()) {
    console.error(utility.replaceTags('Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}'));
    return;
  }

  // Get the task that we're renaming
  const taskId = args._[1];
  if (!taskId) {
    console.error(utility.replaceTags('No task id specified. Try running {b}kanbn rename "task id"{b}'));
    return;
  }

  // Make sure the task exists
  try {
    await kanbn.taskExists(taskId);
  } catch (error) {
    utility.showError(error);
    return;
  }

  // Get the current task data
  let taskData;
  try {
    taskData = await kanbn.getTask(taskId);
  } catch (error) {
    utility.showError(error);
  }
  const currentTaskName = taskData.name;

  // Get new task name from arguments
  if (args.name) {
    taskData.name = args.name;
  }

  // Rename task interactively
  if (args.interactive) {
    interactive(taskData)
    .then(answers => {
      renameTask(taskId, answers.name, currentTaskName);
    })
    .catch(error => {
      utility.showError(error);
    });

  // Otherwise rename task non-interactively
  } else {
    renameTask(taskId, taskData.name, currentTaskName);
  }
};