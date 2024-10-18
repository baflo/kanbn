import kanbn from '../main.js';
import utility from '../utility.js';
import parseTask from '../parse-task.js';
import marked from 'marked';
import markedTerminalRenderer from 'marked-terminal';

/**
 * Show task information
 * @param {string} taskId
 */
function showTask(taskId, json = false) {
  kanbn
    .getTask(taskId)
    .then((task) => {
      if (json) {
        console.log(task);
      } else {
        marked.setOptions({
          renderer: new markedTerminalRenderer(),
        });
        console.log(marked(parseTask.json2md(task)));
      }
    })
    .catch((error) => {
      utility.error(error);
    });
}

export default async (args) => {
  // Make sure kanbn has been initialised
  if (!(await kanbn.initialised())) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }

  // Get the task that we're showing
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn task "task id"{b}');
    return;
  }

  // Make sure the task exists
  try {
    await kanbn.taskExists(taskId);
  } catch (error) {
    utility.error(error);
    return;
  }

  // Show the task
  showTask(taskId, args.json);
};