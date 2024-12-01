import kanbn from "../main.js";
import utility from "../utility.js";
function archiveTask(taskId) {
  kanbn.archiveTask(taskId).then((taskId2) => {
    console.log(`Archived task "${taskId2}"`);
  }).catch((error) => {
    utility.error(error);
  });
}
function listArchivedTasks() {
  kanbn.listArchivedTasks().then((archivedTasks) => {
    console.log(archivedTasks.join("\n"));
  }).catch((error) => {
    utility.error(error);
  });
}
var archive_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  if (args.list) {
    listArchivedTasks();
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn archive "task id"{b}');
    return;
  }
  try {
    await kanbn.taskExists(taskId);
  } catch (error) {
    utility.error(error);
    return;
  }
  archiveTask(taskId);
};
export {
  archive_default as default
};
