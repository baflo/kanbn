import fs from "fs";
import path from "path";
import glob from "glob-promise";
import parseIndex from "./parse-index.js";
import parseTask from "./parse-task.js";
import utility from "./utility.js";
import yaml from "yamljs";
import humanizeDuration from "humanize-duration";
import rimraf from "rimraf";
const DEFAULT_FOLDER_NAME = ".kanbn";
const DEFAULT_INDEX_FILE_NAME = "index.md";
const DEFAULT_TASKS_FOLDER_NAME = "tasks";
const DEFAULT_ARCHIVE_FOLDER_NAME = "archive";
const SECOND = 1e3;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const DEFAULT_TASK_WORKLOAD = 2;
const DEFAULT_TASK_WORKLOAD_TAGS = {
  Nothing: 0,
  Tiny: 1,
  Small: 2,
  Medium: 3,
  Large: 5,
  Huge: 8
};
const DEFAULT_DATE_FORMAT = "d mmm yy, H:MM";
const DEFAULT_TASK_TEMPLATE = "^+^_${overdue ? '^R' : ''}${name}^: ${created ? ('\\n^-^/' + created) : ''}";
const defaultInitialiseOptions = {
  name: "Project Name",
  description: "",
  options: {
    startedColumns: ["In Progress"],
    completedColumns: ["Done"]
  },
  columns: ["Backlog", "Todo", "In Progress", "Done"]
};
async function exists(path2) {
  try {
    await fs.promises.access(path2, fs.constants.R_OK | fs.constants.W_OK);
  } catch (error) {
    return false;
  }
  return true;
}
function getTrackedTaskIds(index, columnName = null) {
  return new Set(
    columnName ? index.columns[columnName] : Object.keys(index.columns).map((columnName2) => index.columns[columnName2]).flat()
  );
}
function getTaskPath(tasksPath, taskId) {
  return path.join(tasksPath, addFileExtension(taskId));
}
function addFileExtension(taskId) {
  if (!/\.md$/.test(taskId)) {
    return `${taskId}.md`;
  }
  return taskId;
}
function removeFileExtension(taskId) {
  if (/\.md$/.test(taskId)) {
    return taskId.slice(0, taskId.length - ".md".length);
  }
  return taskId;
}
function taskInIndex(index, taskId) {
  for (let columnName in index.columns) {
    if (index.columns[columnName].indexOf(taskId) !== -1) {
      return true;
    }
  }
  return false;
}
function findTaskColumn(index, taskId) {
  for (let columnName in index.columns) {
    if (index.columns[columnName].indexOf(taskId) !== -1) {
      return columnName;
    }
  }
  return null;
}
function addTaskToIndex(index, taskId, columnName, position = null) {
  if (position === null) {
    index.columns[columnName].push(taskId);
  } else {
    index.columns[columnName].splice(position, 0, taskId);
  }
  return index;
}
function removeTaskFromIndex(index, taskId) {
  for (let columnName in index.columns) {
    index.columns[columnName] = index.columns[columnName].filter((t) => t !== taskId);
  }
  return index;
}
function renameTaskInIndex(index, taskId, newTaskId) {
  for (let columnName in index.columns) {
    index.columns[columnName] = index.columns[columnName].map((t) => t === taskId ? newTaskId : t);
  }
  return index;
}
function getTaskMetadata(taskData, property) {
  if ("metadata" in taskData && property in taskData.metadata) {
    return taskData.metadata[property];
  }
  return void 0;
}
function setTaskMetadata(taskData, property, value) {
  if (!("metadata" in taskData)) {
    taskData.metadata = {};
  }
  if (property in taskData.metadata && value === void 0) {
    delete taskData.metadata[property];
  } else {
    taskData.metadata[property] = value;
  }
  return taskData;
}
function taskCompleted(index, task) {
  return "completed" in task.metadata || "completedColumns" in index.options && index.options.completedColumns.indexOf(findTaskColumn(index, task.id)) !== -1;
}
function sortColumnInIndex(index, tasks, columnName, sorters) {
  tasks = tasks.map((task) => ({
    ...task,
    ...task.metadata,
    created: "created" in task.metadata ? task.metadata.created : "",
    updated: "updated" in task.metadata ? task.metadata.updated : "",
    started: "started" in task.metadata ? task.metadata.started : "",
    completed: "completed" in task.metadata ? task.metadata.completed : "",
    due: "due" in task.metadata ? task.metadata.due : "",
    assigned: "assigned" in task.metadata ? task.metadata.assigned : "",
    countSubTasks: task.subTasks.length,
    subTasks: task.subTasks.map((subTask) => `[${subTask.completed ? "x" : ""}] ${subTask.text}`).join("\n"),
    countTags: "tags" in task.metadata ? task.metadata.tags.length : 0,
    tags: "tags" in task.metadata ? task.metadata.tags.join("\n") : "",
    countRelations: task.relations.length,
    relations: task.relations.map((relation) => `${relation.type} ${relation.task}`).join("\n"),
    countComments: task.comments.length,
    comments: task.comments.map((comment) => `${comment.author} ${comment.text}`).join("\n"),
    workload: taskWorkload(index, task),
    progress: taskProgress(index, task)
  }));
  tasks = sortTasks(tasks, sorters);
  index.columns[columnName] = tasks.map((task) => task.id);
  return index;
}
function sortTasks(tasks, sorters) {
  tasks.sort((a, b) => {
    let compareA, compareB;
    for (let sorter of sorters) {
      compareA = a[sorter.field];
      compareB = b[sorter.field];
      if (sorter.filter) {
        compareA = sortFilter(compareA, sorter.filter);
        compareB = sortFilter(compareB, sorter.filter);
      }
      if (compareA === compareB) {
        continue;
      }
      return sorter.order === "descending" ? compareValues(compareB, compareA) : compareValues(compareA, compareB);
    }
    return 0;
  });
  return tasks;
}
function sortFilter(value, filter) {
  const matches = [...value.matchAll(new RegExp(filter, "gi"))];
  const result = matches.map((match) => {
    if (match.groups) {
      return Object.values(match.groups).join("");
    }
    if (match[1]) {
      return match[1];
    }
    return match[0];
  });
  return result.join("");
}
function compareValues(a, b) {
  if (a === void 0 && b === void 0) {
    return 0;
  }
  a = utility.coerceUndefined(a, typeof b);
  b = utility.coerceUndefined(b, typeof a);
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b, void 0, { sensitivity: "accent" });
  }
  return a - b;
}
function filterTasks(index, tasks, filters) {
  return tasks.filter((task) => {
    const taskId = utility.getTaskId(task.name);
    const column = findTaskColumn(index, taskId);
    if (Object.keys(filters).length === 0) {
      return true;
    }
    let result = true;
    if ("id" in filters && !stringFilter(filters.id, task.id)) {
      result = false;
    }
    if ("name" in filters && !stringFilter(filters.name, task.name)) {
      result = false;
    }
    if ("description" in filters && !stringFilter(filters.description, task.description)) {
      result = false;
    }
    if ("column" in filters && !stringFilter(filters.column, column)) {
      result = false;
    }
    if ("created" in filters && (!("created" in task.metadata) || !dateFilter(filters.created, task.metadata.created))) {
      result = false;
    }
    if ("updated" in filters && (!("updated" in task.metadata) || !dateFilter(filters.updated, task.metadata.updated))) {
      result = false;
    }
    if ("started" in filters && (!("started" in task.metadata) || !dateFilter(filters.started, task.metadata.started))) {
      result = false;
    }
    if ("completed" in filters && (!("completed" in task.metadata) || !dateFilter(filters.completed, task.metadata.completed))) {
      result = false;
    }
    if ("due" in filters && (!("due" in task.metadata) || !dateFilter(filters.due, task.metadata.due))) {
      result = false;
    }
    if ("workload" in filters && !numberFilter(filters.workload, taskWorkload(index, task))) {
      result = false;
    }
    if ("progress" in filters && !numberFilter(filters.progress, taskProgress(index, task))) {
      result = false;
    }
    if ("assigned" in filters && !stringFilter(filters.assigned, "assigned" in task.metadata ? task.metadata.assigned : "")) {
      result = false;
    }
    if ("sub-task" in filters && !stringFilter(
      filters["sub-task"],
      task.subTasks.map((subTask) => `[${subTask.completed ? "x" : " "}] ${subTask.text}`).join("\n")
    )) {
      result = false;
    }
    if ("count-sub-tasks" in filters && !numberFilter(filters["count-sub-tasks"], task.subTasks.length)) {
      result = false;
    }
    if ("tag" in filters && !stringFilter(filters.tag, task.metadata.tags.join("\n"))) {
      result = false;
    }
    if ("count-tags" in filters && !numberFilter(filters["count-tags"], task.tags.length)) {
      result = false;
    }
    if ("relation" in filters && !stringFilter(
      filters.relation,
      task.relations.map((relation) => `${relation.type} ${relation.task}`).join("\n")
    )) {
      result = false;
    }
    if ("count-relations" in filters && !numberFilter(filters["count-relations"], task.relations.length)) {
      result = false;
    }
    if ("comment" in filters && !stringFilter(filters.comment, task.comments.map((comment) => `${comment.author} ${comment.text}`).join("\n"))) {
      result = false;
    }
    if ("count-comments" in filters && !numberFilter(filters["count-comments"], task.comments.length)) {
      result = false;
    }
    if ("customFields" in index.options) {
      for (let customField of index.options.customFields) {
        if (customField.name in filters) {
          if (!(customField.name in task.metadata)) {
            result = false;
          } else {
            switch (customField.type) {
              case "boolean":
                if (task.metadata[customField.name] !== filters[customField.name]) {
                  result = false;
                }
                break;
              case "number":
                if (!numberFilter(filters[customField.name], task.metadata[customField.name])) {
                  result = false;
                }
                break;
              case "string":
                if (!stringFilter(filters[customField.name], task.metadata[customField.name])) {
                  result = false;
                }
                break;
              case "date":
                if (!dateFilter(filters[customField.name], task.metadata[customField.name])) {
                  result = false;
                }
                break;
              default:
                break;
            }
          }
        }
      }
    }
    return result;
  });
}
function stringFilter(filter, input) {
  if (Array.isArray(filter)) {
    filter = filter.join("|");
  }
  return new RegExp(filter, "i").test(input);
}
function dateFilter(dates, input) {
  dates = utility.arrayArg(dates);
  if (dates.length === 1) {
    return utility.compareDates(input, dates[0]);
  }
  const earliest = Math.min(...dates);
  const latest = Math.max(...dates);
  return input >= earliest && input <= latest;
}
function numberFilter(filter, input) {
  filter = utility.arrayArg(filter);
  return input >= Math.min(...filter) && input <= Math.max(...filter);
}
function taskWorkload(index, task) {
  const defaultTaskWorkload = "defaultTaskWorkload" in index.options ? index.options.defaultTaskWorkload : DEFAULT_TASK_WORKLOAD;
  const taskWorkloadTags = "taskWorkloadTags" in index.options ? index.options.taskWorkloadTags : DEFAULT_TASK_WORKLOAD_TAGS;
  let workload = 0;
  let hasWorkloadTags = false;
  if ("tags" in task.metadata) {
    for (let workloadTag of Object.keys(taskWorkloadTags)) {
      if (task.metadata.tags.indexOf(workloadTag) !== -1) {
        workload += taskWorkloadTags[workloadTag];
        hasWorkloadTags = true;
      }
    }
  }
  if (!hasWorkloadTags) {
    workload = defaultTaskWorkload;
  }
  return workload;
}
function taskProgress(index, task) {
  if (taskCompleted(index, task)) {
    return 1;
  }
  return "progress" in task.metadata ? task.metadata.progress : 0;
}
function taskWorkloadInPeriod(tasks, metadataProperty, start, end) {
  const filteredTasks = tasks.filter(
    (task) => metadataProperty in task.metadata && task.metadata[metadataProperty] >= start && task.metadata[metadataProperty] <= end
  );
  return {
    tasks: filteredTasks.map((task) => ({
      id: task.id,
      column: task.column,
      workload: task.workload
    })),
    workload: filteredTasks.reduce((a, task) => a + task.workload, 0)
  };
}
function getActiveTasksAtDate(tasks, date) {
  return tasks.filter((task) => task.started !== false && task.started <= date && (task.completed === false || task.completed > date));
}
function getWorkloadAtDate(tasks, date) {
  return getActiveTasksAtDate(tasks, date).reduce((a, task) => a += task.workload, 0);
}
function countActiveTasksAtDate(tasks, date) {
  return getActiveTasksAtDate(tasks, date).length;
}
function getTaskEventsAtDate(tasks, date) {
  return [
    ...tasks.filter((task) => (task.created ? task.created.getTime() : 0) === date.getTime()).map((task) => ({
      eventType: "created",
      task
    })),
    ...tasks.filter((task) => (task.started ? task.started.getTime() : 0) === date.getTime()).map((task) => ({
      eventType: "started",
      task
    })),
    ...tasks.filter((task) => (task.completed ? task.completed.getTime() : 0) === date.getTime()).map((task) => ({
      eventType: "completed",
      task
    }))
  ];
}
function normaliseDate(date, resolution = "minutes") {
  const result = new Date(date.getTime());
  switch (resolution) {
    case "days":
      result.setHours(0);
    case "hours":
      result.setMinutes(0);
    case "minutes":
      result.setSeconds(0);
    case "seconds":
      result.setMilliseconds(0);
    default:
      break;
  }
  return result;
}
function updateColumnLinkedCustomFields(index, taskData, columnName) {
  taskData = updateColumnLinkedCustomField(index, taskData, columnName, "completed", "once");
  taskData = updateColumnLinkedCustomField(index, taskData, columnName, "started", "once");
  if ("customFields" in index.options) {
    for (let customField of index.options.customFields) {
      if (customField.type === "date") {
        taskData = updateColumnLinkedCustomField(
          index,
          taskData,
          columnName,
          customField.name,
          customField.updateDate || "none"
        );
      }
    }
  }
  return taskData;
}
function updateColumnLinkedCustomField(index, taskData, columnName, fieldName, updateCriteria = "none") {
  const columnList = `${fieldName}Columns`;
  if (columnList in index.options && index.options[columnList].indexOf(columnName) !== -1) {
    switch (updateCriteria) {
      case "always":
        taskData = setTaskMetadata(taskData, fieldName, /* @__PURE__ */ new Date());
        break;
      case "once":
        if (!(fieldName in taskData.metadata && taskData.metadata[fieldName])) {
          taskData = setTaskMetadata(taskData, fieldName, /* @__PURE__ */ new Date());
        }
        break;
      default:
        break;
    }
  }
  return taskData;
}
class Kanbn {
  ROOT = process.cwd();
  CONFIG_YAML = path.join(this.ROOT, "kanbn.yml");
  CONFIG_JSON = path.join(this.ROOT, "kanbn.json");
  // Memoize config
  configMemo = null;
  constructor(root = null) {
    if (root) {
      this.ROOT = root;
      this.CONFIG_YAML = path.join(this.ROOT, "kanbn.yml");
      this.CONFIG_JSON = path.join(this.ROOT, "kanbn.json");
    }
  }
  /**
   * Check if a separate config file exists
   * @returns {Promise<boolean>} True if a config file exists
   */
  async configExists() {
    return await exists(this.CONFIG_YAML) || await exists(this.CONFIG_JSON);
  }
  /**
   * Save configuration data to a separate config file
   */
  async saveConfig(config) {
    if (await exists(this.CONFIG_YAML)) {
      await fs.promises.writeFile(this.CONFIG_YAML, yaml.stringify(config, 4, 2));
    } else {
      await fs.promises.writeFile(this.CONFIG_JSON, JSON.stringify(config, null, 4));
    }
  }
  /**
   * Get configuration settings from the config file if it exists, otherwise return null
   * @return {Promise<Object|null>} Configuration settings or null if there is no separate config file
   */
  async getConfig() {
    if (this.configMemo === null) {
      let config = null;
      if (await exists(this.CONFIG_YAML)) {
        try {
          config = yaml.load(this.CONFIG_YAML);
        } catch (error) {
          throw new Error(`Couldn't load config file: ${error.message}`);
        }
      } else if (await exists(this.CONFIG_JSON)) {
        try {
          config = JSON.parse(await fs.promises.readFile(this.CONFIG_JSON, { encoding: "utf-8" }));
        } catch (error) {
          throw new Error(`Couldn't load config file: ${error.message}`);
        }
      }
      this.configMemo = config;
    }
    return this.configMemo;
  }
  /**
   * Clear cached config
   */
  clearConfigCache() {
    this.configMemo = null;
  }
  /**
   * Get the name of the folder where the index and tasks are stored
   * @return {Promise<string>} The kanbn folder name
   */
  async getFolderName() {
    const config = await this.getConfig();
    if (config !== null && "mainFolder" in config) {
      return config.mainFolder;
    }
    return DEFAULT_FOLDER_NAME;
  }
  /**
   * Get the index filename
   * @return {Promise<string>} The index filename
   */
  async getIndexFileName() {
    const config = await this.getConfig();
    if (config !== null && "indexFile" in config) {
      return config.indexFile;
    }
    return DEFAULT_INDEX_FILE_NAME;
  }
  /**
   * Get the name of the folder where tasks are stored
   * @return {Promise<string>} The task folder name
   */
  async getTaskFolderName() {
    const config = await this.getConfig();
    if (config !== null && "taskFolder" in config) {
      return config.taskFolder;
    }
    return DEFAULT_TASKS_FOLDER_NAME;
  }
  /**
   * Get the name of the archive folder
   * @return {Promise<string>} The archive folder name
   */
  async getArchiveFolderName() {
    const config = await this.getConfig();
    if (config !== null && "archiveFolder" in config) {
      return config.archiveFolder;
    }
    return DEFAULT_ARCHIVE_FOLDER_NAME;
  }
  /**
   * Get the kanbn folder location for the current working directory
   * @return {Promise<string>} The kanbn folder path
   */
  async getMainFolder() {
    return path.join(this.ROOT, await this.getFolderName());
  }
  /**
   * Get the index path
   * @return {Promise<string>} The kanbn index path
   */
  async getIndexPath() {
    return path.join(await this.getMainFolder(), await this.getIndexFileName());
  }
  /**
   * Get the task folder path
   * @return {Promise<string>} The kanbn task folder path
   */
  async getTaskFolderPath() {
    return path.join(await this.getMainFolder(), await this.getTaskFolderName());
  }
  /**
   * Get the archive folder path
   * @return {Promise<string>} The kanbn archive folder path
   */
  async getArchiveFolderPath() {
    return path.join(await this.getMainFolder(), await this.getArchiveFolderName());
  }
  /**
   * Get the index as an object
   * @return {Promise<index>} The index
   */
  async getIndex() {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    return this.loadIndex();
  }
  /**
   * Get a task as an object
   * @param {string} taskId The task id to get
   * @return {Promise<task>} The task
   */
  async getTask(taskId) {
    this.taskExists(taskId);
    return this.loadTask(taskId);
  }
  /**
   * Add additional index-based information to a task
   * @param {index} index The index object
   * @param {task} task The task object
   * @return {task} The hydrated task
   */
  hydrateTask(index, task) {
    const completed = taskCompleted(index, task);
    task.column = findTaskColumn(index, task.id);
    task.workload = taskWorkload(index, task);
    task.progress = taskProgress(index, task);
    task.remainingWorkload = Math.ceil(task.workload * (1 - task.progress));
    if ("due" in task.metadata) {
      const dueData = {};
      const completedDate = "completed" in task.metadata ? task.metadata.completed : null;
      let delta;
      if (completedDate !== null) {
        delta = completedDate - task.metadata.due;
      } else {
        delta = /* @__PURE__ */ new Date() - task.metadata.due;
      }
      dueData.completed = completed;
      dueData.completedDate = completedDate;
      dueData.dueDate = task.metadata.due;
      dueData.overdue = !completed && delta > 0;
      dueData.dueDelta = delta;
      let dueMessage = "";
      if (completed) {
        dueMessage += "Completed ";
      }
      dueMessage += `${humanizeDuration(delta, {
        largest: 3,
        round: true
      })} ${delta > 0 ? "overdue" : "remaining"}`;
      dueData.dueMessage = dueMessage;
      task.dueData = dueData;
    }
    return task;
  }
  /**
   * Return a filtered and sorted list of tasks
   * @param {index} index The index object
   * @param {task[]} tasks A list of task objects
   * @param {object} filters A list of task filters
   * @param {object[]} sorters A list of task sorters
   * @return {object[]} A filtered and sorted list of tasks
   */
  filterAndSortTasks(index, tasks, filters, sorters) {
    return sortTasks(filterTasks(index, tasks, filters), sorters);
  }
  /**
   * Overwrite the index file with the specified data
   * @param {object} indexData Index data to save
   */
  async saveIndex(indexData) {
    if (indexData.options.indexVersion === void 0) {
      indexData.options.indexVersion = 2;
    }
    if ("columnSorting" in indexData.options && Object.keys(indexData.options.columnSorting).length) {
      for (let columnName in indexData.options.columnSorting) {
        indexData = sortColumnInIndex(
          indexData,
          await this.loadAllTrackedTasks(indexData, columnName),
          columnName,
          indexData.options.columnSorting[columnName]
        );
      }
    }
    let ignoreOptions = false;
    if (await this.configExists()) {
      await this.saveConfig(indexData.options);
      ignoreOptions = true;
    }
    if (indexData.options.indexVersion === 2) {
      await fs.promises.writeFile(await this.getIndexPath(), parseIndex.json2md_v2(indexData, ignoreOptions));
    } else {
      await fs.promises.writeFile(await this.getIndexPath(), parseIndex.json2md(indexData, ignoreOptions));
    }
  }
  /**
   * Load the index file and parse it to an object
   * @return {Promise<object>} The index object
   */
  async loadIndex() {
    let indexData = "";
    try {
      indexData = await fs.promises.readFile(await this.getIndexPath(), { encoding: "utf-8" });
    } catch (error) {
      throw new Error(`Couldn't access index file: ${error.message}`);
    }
    const index = parseIndex.md2json(indexData);
    const config = await this.getConfig();
    if (config !== null) {
      index.options = { ...index.options, ...config };
    }
    return index;
  }
  /**
   * Overwrite a task file with the specified data
   * @param {string} path The task path
   * @param {object} taskData The task data
   */
  async saveTask(path2, taskData) {
    await fs.promises.writeFile(path2, parseTask.json2md(taskData));
  }
  /**
   * Load a task file and parse it to an object
   * @param {string} taskId The task id
   * @return {Promise<object>} The task object
   */
  async loadTask(taskId) {
    const taskPath = path.join(await this.getTaskFolderPath(), addFileExtension(taskId));
    let taskData = "";
    try {
      taskData = await fs.promises.readFile(taskPath, { encoding: "utf-8" });
    } catch (error) {
      throw new Error(`Couldn't access task file: ${error.message}`);
    }
    return parseTask.md2json(taskData);
  }
  /**
   * Load all tracked tasks and return an array of task objects
   * @param {object} index The index object
   * @param {?string} [columnName=null] The optional column name to filter tasks by
   * @return {Promise<object[]>} All tracked tasks
   */
  async loadAllTrackedTasks(index, columnName = null) {
    const result = [];
    const trackedTasks = getTrackedTaskIds(index, columnName);
    for (let taskId of trackedTasks) {
      result.push(await this.loadTask(taskId));
    }
    return result;
  }
  /**
   * Load a task file from the archive and parse it to an object
   * @param {string} taskId The task id
   * @return {Promise<object>} The task object
   */
  async loadArchivedTask(taskId) {
    const taskPath = path.join(await this.getArchiveFolderPath(), addFileExtension(taskId));
    let taskData = "";
    try {
      taskData = await fs.promises.readFile(taskPath, { encoding: "utf-8" });
    } catch (error) {
      throw new Error(`Couldn't access archived task file: ${error.message}`);
    }
    return parseTask.md2json(taskData);
  }
  /**
   * Get the date format defined in the index, or the default date format
   * @param {object} index The index object
   * @return {string} The date format
   */
  getDateFormat(index) {
    return "dateFormat" in index.options ? index.options.dateFormat : DEFAULT_DATE_FORMAT;
  }
  /**
   * Get the task template for displaying tasks on the kanbn board from the index, or the default task template
   * @param {object} index The index object
   * @return {string} The task template
   */
  getTaskTemplate(index) {
    return "taskTemplate" in index.options ? index.options.taskTemplate : DEFAULT_TASK_TEMPLATE;
  }
  /**
   * Check if the current working directory has been initialised
   * @return {Promise<boolean>} True if the current working directory has been initialised, otherwise false
   */
  async initialised() {
    return await exists(await this.getIndexPath());
  }
  /**
   * Initialise a kanbn board in the current working directory
   * @param {object} [options={}] Initial columns and other config options
   */
  async initialise(options = {}) {
    const mainFolder = await this.getMainFolder();
    if (!await exists(mainFolder)) {
      await fs.promises.mkdir(mainFolder, { recursive: true });
    }
    const taskFolder = await this.getTaskFolderPath();
    if (!await exists(taskFolder)) {
      await fs.promises.mkdir(taskFolder, { recursive: true });
    }
    let index;
    if (!await exists(await this.getIndexPath())) {
      const config = await this.getConfig();
      const opts = Object.assign({}, defaultInitialiseOptions, options);
      index = {
        name: opts.name,
        description: opts.description,
        options: Object.assign({}, opts.options, config || {}),
        columns: Object.fromEntries(opts.columns.map((columnName) => [columnName, []]))
      };
    } else if (Object.keys(options).length > 0) {
      index = await this.loadIndex();
      "name" in options && (index.name = options.name);
      "description" in options && (index.description = options.description);
      "options" in options && (index.options = Object.assign(index.options, options.options));
      "columns" in options && (index.columns = Object.assign(
        index.columns,
        Object.fromEntries(
          options.columns.map((columnName) => [
            columnName,
            columnName in index.columns ? index.columns[columnName] : []
          ])
        )
      ));
    }
    await this.saveIndex(index);
  }
  /**
   * Check if a task file exists and is in the index, otherwise throw an error
   * @param {string} taskId The task id to check
   */
  async taskExists(taskId) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`No task with id "${taskId}" found in the index`);
    }
  }
  /**
   * Get the column that a task is in or throw an error if the task doesn't exist or isn't indexed
   * @param {string} taskId The task id to find
   * @return {Promise<string>} The name of the column the task is in
   */
  async findTaskColumn(taskId) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`No task with id "${taskId}" found in the index`);
    }
    return findTaskColumn(index, taskId);
  }
  /**
   * Create a task file and add the task to the index
   * @param {object} taskData The task object
   * @param {string} columnName The name of the column to add the task to
   * @return {Promise<string>} The id of the task that was created
   */
  async createTask(taskData, columnName) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    if (!taskData.name) {
      throw new Error("Task name cannot be blank");
    }
    const taskId = utility.getTaskId(taskData.name);
    const taskPath = getTaskPath(await this.getTaskFolderPath(), taskId);
    if (await exists(taskPath)) {
      throw new Error(`A task with id "${taskId}" already exists`);
    }
    let index = await this.loadIndex();
    if (!(columnName in index.columns)) {
      throw new Error(`Column "${columnName}" doesn't exist`);
    }
    if (taskInIndex(index, taskId)) {
      throw new Error(`A task with id "${taskId}" is already in the index`);
    }
    taskData = setTaskMetadata(taskData, "created", /* @__PURE__ */ new Date());
    taskData = updateColumnLinkedCustomFields(index, taskData, columnName);
    await this.saveTask(taskPath, taskData);
    index = addTaskToIndex(index, taskId, columnName);
    await this.saveIndex(index);
    return taskId;
  }
  /**
   * Add an untracked task to the specified column in the index
   * @param {string} taskId The untracked task id
   * @param {string} columnName The column to add the task to
   * @return {Promise<string>} The id of the task that was added
   */
  async addUntrackedTaskToIndex(taskId, columnName) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!(columnName in index.columns)) {
      throw new Error(`Column "${columnName}" doesn't exist`);
    }
    if (taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is already in the index`);
    }
    let taskData = await this.loadTask(taskId);
    const taskPath = getTaskPath(await this.getTaskFolderPath(), taskId);
    taskData = updateColumnLinkedCustomFields(index, taskData, columnName);
    await this.saveTask(taskPath, taskData);
    index = addTaskToIndex(index, taskId, columnName);
    await this.saveIndex(index);
    return taskId;
  }
  /**
   * Get a list of tracked tasks (i.e. tasks that are listed in the index)
   * @param {?string} [columnName=null] The optional column name to filter tasks by
   * @return {Promise<Set>} A set of task ids
   */
  async findTrackedTasks(columnName = null) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const index = await this.loadIndex();
    return getTrackedTaskIds(index, columnName);
  }
  /**
   * Get a list of untracked tasks (i.e. markdown files in the tasks folder that aren't listed in the index)
   * @return {Promise<Set>} A set of untracked task ids
   */
  async findUntrackedTasks() {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const index = await this.loadIndex();
    const trackedTasks = getTrackedTaskIds(index);
    const files = await glob(`${await this.getTaskFolderPath()}/*.md`);
    const untrackedTasks = new Set(files.map((task) => path.parse(task).name));
    return new Set([...untrackedTasks].filter((x) => !trackedTasks.has(x)));
  }
  /**
   * Update an existing task
   * @param {string} taskId The id of the task to update
   * @param {object} taskData The new task data
   * @param {?string} [columnName=null] The column name to move this task to, or null if not moving this task
   * @return {Promise<string>} The id of the task that was updated
   */
  async updateTask(taskId, taskData, columnName = null) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is not in the index`);
    }
    if (!taskData.name) {
      throw new Error("Task name cannot be blank");
    }
    const originalTaskData = await this.loadTask(taskId);
    if (originalTaskData.name !== taskData.name) {
      taskId = await this.renameTask(taskId, taskData.name);
      index = await this.loadIndex();
    }
    if (columnName && !(columnName in index.columns)) {
      throw new Error(`Column "${columnName}" doesn't exist`);
    }
    taskData = setTaskMetadata(taskData, "updated", /* @__PURE__ */ new Date());
    await this.saveTask(getTaskPath(await this.getTaskFolderPath(), taskId), taskData);
    if (columnName) {
      await this.moveTask(taskId, columnName);
    } else {
      await this.saveIndex(index);
    }
    return taskId;
  }
  /**
   * Change a task name, rename the task file and update the task id in the index
   * @param {string} taskId The id of the task to rename
   * @param {string} newTaskName The new task name
   * @return {Promise<string>} The new id of the task that was renamed
   */
  async renameTask(taskId, newTaskName) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is not in the index`);
    }
    const newTaskId = utility.getTaskId(newTaskName);
    const newTaskPath = getTaskPath(await this.getTaskFolderPath(), newTaskId);
    if (await exists(newTaskPath)) {
      throw new Error(`A task with id "${newTaskId}" already exists`);
    }
    if (taskInIndex(index, newTaskId)) {
      throw new Error(`A task with id "${newTaskId}" is already in the index`);
    }
    let taskData = await this.loadTask(taskId);
    taskData.name = newTaskName;
    taskData = setTaskMetadata(taskData, "updated", /* @__PURE__ */ new Date());
    await this.saveTask(getTaskPath(await this.getTaskFolderPath(), taskId), taskData);
    await fs.promises.rename(getTaskPath(await this.getTaskFolderPath(), taskId), newTaskPath);
    index = renameTaskInIndex(index, taskId, newTaskId);
    await this.saveIndex(index);
    return newTaskId;
  }
  /**
   * Move a task from one column to another column
   * @param {string} taskId The task id to move
   * @param {string} columnName The name of the column that the task will be moved to
   * @param {?number} [position=null] The position to move the task to within the target column
   * @param {boolean} [relative=false] Treat the position argument as relative instead of absolute
   * @return {Promise<string>} The id of the task that was moved
   */
  async moveTask(taskId, columnName, position = null, relative = false) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is not in the index`);
    }
    if (!(columnName in index.columns)) {
      throw new Error(`Column "${columnName}" doesn't exist`);
    }
    let taskData = await this.loadTask(taskId);
    taskData = setTaskMetadata(taskData, "updated", /* @__PURE__ */ new Date());
    taskData = updateColumnLinkedCustomFields(index, taskData, columnName);
    await this.saveTask(getTaskPath(await this.getTaskFolderPath(), taskId), taskData);
    const currentColumnName = findTaskColumn(index, taskId);
    const currentPosition = index.columns[currentColumnName].indexOf(taskId);
    if (position) {
      if (relative) {
        position = currentPosition + position;
      }
      position = Math.max(Math.min(position, index.columns[currentColumnName].length), 0);
    }
    index = removeTaskFromIndex(index, taskId);
    index = addTaskToIndex(index, taskId, columnName, position);
    await this.saveIndex(index);
    return taskId;
  }
  /**
   * Remove a task from the index and optionally delete the task file as well
   * @param {string} taskId The id of the task to remove
   * @param {boolean} [removeFile=false] True if the task file should be removed
   * @return {Promise<string>} The id of the task that was deleted
   */
  async deleteTask(taskId, removeFile = false) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is not in the index`);
    }
    index = removeTaskFromIndex(index, taskId);
    if (removeFile && await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      await fs.promises.unlink(getTaskPath(await this.getTaskFolderPath(), taskId));
    }
    await this.saveIndex(index);
    return taskId;
  }
  /**
   * Search for indexed tasks
   * @param {object} [filters={}] The filters to apply
   * @param {boolean} [quiet=false] Only return task ids if true, otherwise return full task details
   * @return {Promise<object[]>} A list of tasks that match the filters
   */
  async search(filters = {}, quiet = false) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const index = await this.loadIndex();
    let tasks = filterTasks(index, await this.loadAllTrackedTasks(index), filters);
    return tasks.map((task) => {
      return quiet ? utility.getTaskId(task.name) : this.hydrateTask(index, task);
    });
  }
  /**
   * Output project status information
   * @param {boolean} [quiet=false] Output full or partial status information
   * @param {boolean} [untracked=false] Show a list of untracked tasks
   * @param {boolean} [due=false] Show information about overdue tasks and time remaining
   * @param {?string|?number} [sprint=null] The sprint name or number to show stats for, or null for current sprint
   * @param {?Date[]} [dates=null] The date(s) to show stats for, or null for no date filter
   * @return {Promise<object|string[]>} Project status information as an object, or an array of untracked task filenames
   */
  async status(quiet = false, untracked = false, due = false, sprint2 = null, dates = null) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const index = await this.loadIndex();
    const columnNames = Object.keys(index.columns);
    const result = {
      name: index.name
    };
    if (untracked) {
      result.untrackedTasks = [...await this.findUntrackedTasks()].map((taskId) => `${taskId}.md`);
      if (quiet) {
        return result.untrackedTasks;
      }
    }
    result.tasks = columnNames.reduce((a, v) => a + index.columns[v].length, 0);
    result.columnTasks = Object.fromEntries(
      columnNames.map((columnName) => [columnName, index.columns[columnName].length])
    );
    if ("startedColumns" in index.options && index.options.startedColumns.length > 0) {
      result.startedTasks = Object.entries(index.columns).filter((c) => index.options.startedColumns.indexOf(c[0]) > -1).reduce((a, c) => a + c[1].length, 0);
    }
    if ("completedColumns" in index.options && index.options.completedColumns.length > 0) {
      result.completedTasks = Object.entries(index.columns).filter((c) => index.options.completedColumns.indexOf(c[0]) > -1).reduce((a, c) => a + c[1].length, 0);
    }
    if (!quiet) {
      const tasks = [...await this.loadAllTrackedTasks(index)].map((task) => this.hydrateTask(index, task));
      if (due) {
        result.dueTasks = [];
        tasks.forEach((task) => {
          if ("dueData" in task) {
            result.dueTasks.push({
              task: task.id,
              workload: task.workload,
              progress: task.progress,
              remainingWorkload: task.remainingWorkload,
              ...task.dueData
            });
          }
        });
      }
      let totalWorkload = 0, totalRemainingWorkload = 0;
      const columnWorkloads = tasks.reduce(
        (a, task) => {
          totalWorkload += task.workload;
          totalRemainingWorkload += task.remainingWorkload;
          a[task.column].workload += task.workload;
          a[task.column].remainingWorkload += task.remainingWorkload;
          return a;
        },
        Object.fromEntries(
          columnNames.map((columnName) => [
            columnName,
            {
              workload: 0,
              remainingWorkload: 0
            }
          ])
        )
      );
      result.totalWorkload = totalWorkload;
      result.totalRemainingWorkload = totalRemainingWorkload;
      result.columnWorkloads = columnWorkloads;
      result.taskWorkloads = Object.fromEntries(
        tasks.map((task) => [
          task.id,
          {
            workload: task.workload,
            progress: task.progress,
            remainingWorkload: task.remainingWorkload,
            completed: taskCompleted(index, task)
          }
        ])
      );
      const assignedTasks = tasks.reduce((a, task) => {
        if ("assigned" in task.metadata) {
          if (!(task.metadata.assigned in a)) {
            a[task.metadata.assigned] = {
              total: 0,
              workload: 0,
              remainingWorkload: 0
            };
          }
          a[task.metadata.assigned].total++;
          a[task.metadata.assigned].workload += task.workload;
          a[task.metadata.assigned].remainingWorkload += task.remainingWorkload;
        }
        return a;
      }, {});
      if (Object.keys(assignedTasks).length > 0) {
        result.assigned = assignedTasks;
      }
      if ("sprints" in index.options && index.options.sprints.length) {
        const sprints = index.options.sprints;
        const currentSprint = index.options.sprints.length;
        let sprintIndex = currentSprint - 1;
        if (sprint2 !== null) {
          if (typeof sprint2 === "number") {
            if (sprint2 < 1 || sprint2 > sprints.length) {
              throw new Error(`Sprint ${sprint2} does not exist`);
            } else {
              sprintIndex = sprint2 - 1;
            }
          } else if (typeof sprint2 === "string") {
            sprintIndex = sprints.findIndex((s) => s.name === sprint2);
            if (sprintIndex === -1) {
              throw new Error(`No sprint found with name "${sprint2}"`);
            }
          }
        }
        result.sprint = {
          number: sprintIndex + 1,
          name: sprints[sprintIndex].name,
          start: sprints[sprintIndex].start
        };
        if (currentSprint - 1 !== sprintIndex) {
          if (sprintIndex === sprints.length - 1) {
            result.sprint.end = sprints[sprintIndex + 1].start;
          }
          result.sprint.current = currentSprint;
        }
        if (sprints[sprintIndex].description) {
          result.sprint.description = sprints[sprintIndex].description;
        }
        const sprintStartDate = sprints[sprintIndex].start;
        const sprintEndDate = sprintIndex === sprints.length - 1 ? /* @__PURE__ */ new Date() : sprints[sprintIndex + 1].start;
        const duration = sprintEndDate - sprintStartDate;
        result.sprint.durationDelta = duration;
        result.sprint.durationMessage = humanizeDuration(duration, {
          largest: 3,
          round: true
        });
        result.sprint.created = taskWorkloadInPeriod(tasks, "created", sprintStartDate, sprintEndDate);
        result.sprint.started = taskWorkloadInPeriod(tasks, "started", sprintStartDate, sprintEndDate);
        result.sprint.completed = taskWorkloadInPeriod(tasks, "completed", sprintStartDate, sprintEndDate);
        result.sprint.due = taskWorkloadInPeriod(tasks, "due", sprintStartDate, sprintEndDate);
        if ("customFields" in index.options) {
          for (let customField of index.options.customFields) {
            if (customField.type === "date") {
              result.sprint[customField.name] = taskWorkloadInPeriod(
                tasks,
                customField.name,
                sprintStartDate,
                sprintEndDate
              );
            }
          }
        }
      }
      if (dates !== null && dates.length > 0) {
        let periodStart, periodEnd;
        result.period = {};
        if (dates.length === 1) {
          periodStart = /* @__PURE__ */ new Date(+dates[0]);
          periodStart.setHours(0, 0, 0, 0);
          periodEnd = /* @__PURE__ */ new Date(+dates[0]);
          periodEnd.setHours(23, 59, 59, 999);
          result.period.start = periodStart;
          result.period.end = periodEnd;
        } else {
          result.period.start = periodStart = new Date(Math.min(...dates));
          result.period.end = periodEnd = new Date(Math.max(...dates));
        }
        result.period.created = taskWorkloadInPeriod(tasks, "created", periodStart, periodEnd);
        result.period.started = taskWorkloadInPeriod(tasks, "started", periodStart, periodEnd);
        result.period.completed = taskWorkloadInPeriod(tasks, "completed", periodStart, periodEnd);
        result.period.due = taskWorkloadInPeriod(tasks, "due", periodStart, periodEnd);
        if ("customFields" in index.options) {
          for (let customField of index.options.customFields) {
            if (customField.type === "date") {
              result.sprint[customField.name] = taskWorkloadInPeriod(tasks, customField.name, periodStart, periodEnd);
            }
          }
        }
      }
    }
    return result;
  }
  /**
   * Validate the index and task files
   * @param {boolean} [save=false] Re-save all files
   * @return {Promise<boolean>} True if everything validated, otherwise an array of parsing errors
   */
  async validate(save = false) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const errors = [];
    let index = null;
    try {
      index = await this.loadIndex();
      if (save) {
        await this.saveIndex(index);
      }
    } catch (error) {
      errors.push({
        task: null,
        errors: error.message
      });
    }
    if (errors.length) {
      return errors;
    }
    const trackedTasks = getTrackedTaskIds(index);
    for (let taskId of trackedTasks) {
      try {
        const task = await this.loadTask(taskId);
        if (save) {
          await this.saveTask(getTaskPath(await this.getTaskFolderPath(), taskId), task);
        }
      } catch (error) {
        errors.push({
          task: taskId,
          errors: error.message
        });
      }
    }
    if (errors.length) {
      return errors;
    }
    return true;
  }
  /**
   * Sort a column in the index
   * @param {string} columnName The column name to sort
   * @param {object[]} sorters A list of objects containing the field to sort by, filters and sort order
   * @param {boolean} [save=false] True if the settings should be saved in index
   */
  async sort(columnName, sorters, save = false) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    let index = await this.loadIndex();
    if (!(columnName in index.columns)) {
      throw new Error(`Column "${columnName}" doesn't exist`);
    }
    if (save) {
      if (!("columnSorting" in index.options)) {
        index.options.columnSorting = {};
      }
      index.options.columnSorting[columnName] = sorters;
    } else {
      if ("columnSorting" in index.options && columnName in index.options.columnSorting) {
        delete index.options.columnSorting[columnName];
      }
      const tasks = await this.loadAllTrackedTasks(index, columnName);
      index = sortColumnInIndex(index, tasks, columnName, sorters);
    }
    await this.saveIndex(index);
  }
  /**
   * Start a sprint
   * @param {string} name Sprint name
   * @param {string} description Sprint description
   * @param {Date} start Sprint start date
   * @return {Promise<object>} The sprint object
   */
  async sprint(name, description, start) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const index = await this.loadIndex();
    if (!("sprints" in index.options)) {
      index.options.sprints = [];
    }
    const sprintNumber = index.options.sprints.length + 1;
    const sprint2 = {
      start
    };
    if (!name) {
      sprint2.name = `Sprint ${sprintNumber}`;
    } else {
      sprint2.name = name;
    }
    if (description) {
      sprint2.description = description;
    }
    index.options.sprints.push(sprint2);
    await this.saveIndex(index);
    return sprint2;
  }
  /**
   * Output burndown chart data
   * @param {?string[]} [sprints=null] The sprint names or numbers to show a chart for, or null for
   * the current sprint
   * @param {?Date[]} [dates=null] The dates to show a chart for, or null for no date filter
   * @param {?string} [assigned=null] The assigned user to filter for, or null for no assigned filter
   * @param {?string[]} [columns=null] The columns to filter for, or null for no column filter
   * @param {?string} [normalise=null] The date normalisation mode
   * @return {Promise<object>} Burndown chart data as an object
   */
  async burndown(sprints = null, dates = null, assigned = null, columns = null, normalise = null) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const index = await this.loadIndex();
    const tasks = [...await this.loadAllTrackedTasks(index)].map((task) => {
      const created = "created" in task.metadata ? task.metadata.created : /* @__PURE__ */ new Date(0);
      return {
        ...task,
        created,
        started: "started" in task.metadata ? task.metadata.started : "startedColumns" in index.options && index.options.startedColumns.indexOf(task.column) !== -1 ? created : false,
        completed: "completed" in task.metadata ? task.metadata.completed : "completedColumns" in index.options && index.options.completedColumns.indexOf(task.column) !== -1 ? created : false,
        progress: taskProgress(index, task),
        assigned: "assigned" in task.metadata ? task.metadata.assigned : null,
        workload: taskWorkload(index, task),
        column: findTaskColumn(index, task.id)
      };
    }).filter(
      (task) => (assigned === null || task.assigned === assigned) && (columns === null || columns.indexOf(task.column) !== -1)
    );
    const series = [];
    const indexSprints = "sprints" in index.options && index.options.sprints.length ? index.options.sprints : null;
    if (sprints === null && dates === null) {
      if (indexSprints !== null) {
        const currentSprint = indexSprints.length - 1;
        series.push({
          sprint: indexSprints[currentSprint],
          from: new Date(indexSprints[currentSprint].start),
          to: /* @__PURE__ */ new Date()
        });
      } else {
        series.push({
          from: new Date(
            Math.min(
              ...tasks.map(
                (t) => [
                  "created" in t.metadata && t.metadata.created,
                  "started" in t.metadata && t.metadata.started,
                  "completed" in t.metadata && (t.metadata.completed || /* @__PURE__ */ new Date(864e13))
                ].filter((d) => d)
              ).flat()
            )
          ),
          to: /* @__PURE__ */ new Date()
        });
      }
    } else {
      if (sprints !== null) {
        if (indexSprints === null) {
          throw new Error(`No sprints defined`);
        } else {
          for (sprint of sprints) {
            let sprintIndex = null;
            if (typeof sprint === "number") {
              if (sprint < 1 || sprint > indexSprints.length) {
                throw new Error(`Sprint ${sprint} does not exist`);
              } else {
                sprintIndex = sprint - 1;
              }
            } else if (typeof sprint === "string") {
              sprintIndex = indexSprints.findIndex((s) => s.name === sprint);
              if (sprintIndex === -1) {
                throw new Error(`No sprint found with name "${sprint}"`);
              }
            }
            if (sprintIndex === null) {
              throw new Error(`Invalid sprint "${sprint}"`);
            }
            series.push({
              sprint: indexSprints[sprintIndex],
              from: new Date(indexSprints[sprintIndex].start),
              to: sprintIndex < indexSprints.length - 1 ? new Date(indexSprints[sprintIndex + 1].start) : /* @__PURE__ */ new Date()
            });
          }
        }
      }
      if (dates !== null) {
        series.push({
          from: new Date(Math.min(...dates)),
          to: dates.length === 1 ? /* @__PURE__ */ new Date() : new Date(Math.max(...dates))
        });
      }
    }
    if (normalise === "auto") {
      const delta = series[0].to - series[0].from;
      if (delta >= DAY * 7) {
        normalise = "days";
      } else if (delta >= DAY) {
        normalise = "hours";
      } else if (delta >= HOUR) {
        normalise = "minutes";
      } else {
        normalise = "seconds";
      }
    }
    if (normalise !== null) {
      series.forEach((s) => {
        s.from = normaliseDate(s.from, normalise);
        s.to = normaliseDate(s.to, normalise);
      });
      tasks.forEach((task) => {
        if (task.created) {
          task.created = normaliseDate(task.created, normalise);
        }
        if (task.started) {
          task.started = normaliseDate(task.started, normalise);
        }
        if (task.completed) {
          task.completed = normaliseDate(task.completed, normalise);
        }
      });
    }
    series.forEach((s) => {
      s.dataPoints = [
        {
          x: s.from,
          y: getWorkloadAtDate(tasks, s.from),
          count: countActiveTasksAtDate(tasks, s.from),
          tasks: getTaskEventsAtDate(tasks, s.from)
        },
        ...tasks.filter((task) => {
          let result = false;
          if (task.created && task.created >= s.from && task.created <= s.to) {
            result = true;
          }
          if (task.started && task.started >= s.from && task.started <= s.to) {
            result = true;
          }
          if (task.completed && task.completed >= s.from && task.completed <= s.to) {
            result = true;
          }
          return result;
        }).map((task) => [
          task.created,
          task.started,
          task.completed
        ]).flat().filter((d) => d).map((x) => ({
          x,
          y: getWorkloadAtDate(tasks, x),
          count: countActiveTasksAtDate(tasks, x),
          tasks: getTaskEventsAtDate(tasks, x)
        })),
        {
          x: s.to,
          y: getWorkloadAtDate(tasks, s.to),
          count: countActiveTasksAtDate(tasks, s.to),
          tasks: getTaskEventsAtDate(tasks, s.to)
        }
      ].sort((a, b) => a.x.getTime() - b.x.getTime());
    });
    return { series };
  }
  /**
   * Add a comment to a task
   * @param {string} taskId The task id
   * @param {string} text The comment text
   * @param {string} author The comment author
   * @return {Promise<string>} The task id
   */
  async comment(taskId, text, author) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is not in the index`);
    }
    if (!text) {
      throw new Error("Comment text cannot be empty");
    }
    const taskData = await this.loadTask(taskId);
    const taskPath = getTaskPath(await this.getTaskFolderPath(), taskId);
    taskData.comments.push({
      text,
      author,
      date: /* @__PURE__ */ new Date()
    });
    await this.saveTask(taskPath, taskData);
    return taskId;
  }
  /**
   * Return a list of archived tasks
   * @return {Promise<string[]>} A list of archived task ids
   */
  async listArchivedTasks() {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    const archiveFolder = await this.getArchiveFolderPath();
    if (!await exists(archiveFolder)) {
      throw new Error("Archive folder doesn't exist");
    }
    const files = await glob(`${archiveFolder}/*.md`);
    return [...new Set(files.map((task) => path.parse(task).name))];
  }
  /**
   * Move a task to the archive
   * @param {string} taskId The task id
   * @return {Promise<string>} The task id
   */
  async archiveTask(taskId) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    if (!await exists(getTaskPath(await this.getTaskFolderPath(), taskId))) {
      throw new Error(`No task file found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (!taskInIndex(index, taskId)) {
      throw new Error(`Task "${taskId}" is not in the index`);
    }
    const archiveFolder = await this.getArchiveFolderPath();
    const archivedTaskPath = getTaskPath(archiveFolder, taskId);
    if (await exists(archivedTaskPath)) {
      throw new Error(`An archived task with id "${taskId}" already exists`);
    }
    if (!await exists(archiveFolder)) {
      await fs.promises.mkdir(archiveFolder, { recursive: true });
    }
    let taskData = await this.loadTask(taskId);
    taskData = setTaskMetadata(taskData, "column", findTaskColumn(index, taskId));
    await this.saveTask(archivedTaskPath, taskData);
    await this.deleteTask(taskId, true);
    return taskId;
  }
  /**
   * Restore a task from the archive
   * @param {string} taskId The task id
   * @param {?string} [columnName=null] The column to restore the task to
   * @return {Promise<string>} The task id
   */
  async restoreTask(taskId, columnName = null) {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    taskId = removeFileExtension(taskId);
    const archiveFolder = await this.getArchiveFolderPath();
    const archivedTaskPath = getTaskPath(archiveFolder, taskId);
    const taskPath = getTaskPath(await this.getTaskFolderPath(), taskId);
    if (!await exists(archiveFolder)) {
      throw new Error("Archive folder doesn't exist");
    }
    if (!await exists(archivedTaskPath)) {
      throw new Error(`No archived task found with id "${taskId}"`);
    }
    let index = await this.loadIndex();
    if (taskInIndex(index, taskId)) {
      throw new Error(`There is already an indexed task with id "${taskId}"`);
    }
    if (await exists(taskPath)) {
      throw new Error(`There is already an untracked task with id "${taskId}"`);
    }
    const columns = Object.keys(index.columns);
    if (columns.length === 0) {
      throw new Error("No columns defined in the index");
    }
    let taskData = await this.loadArchivedTask(taskId);
    let actualColumnName = columnName || getTaskMetadata(taskData, "column") || columns[0];
    taskData = setTaskMetadata(taskData, "column", void 0);
    taskData = updateColumnLinkedCustomFields(index, taskData, actualColumnName);
    await this.saveTask(taskPath, taskData);
    index = addTaskToIndex(index, taskId, actualColumnName);
    await this.saveIndex(index);
    await fs.promises.unlink(archivedTaskPath);
    return taskId;
  }
  /**
   * Nuke it from orbit, it's the only way to be sure
   */
  async removeAll() {
    if (!await this.initialised()) {
      throw new Error("Not initialised in this folder");
    }
    rimraf.sync(await this.getMainFolder());
  }
}
;
var main_default = new Kanbn();
export {
  Kanbn,
  main_default as default
};
