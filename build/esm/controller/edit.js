import kanbn from "../main.js";
import utility from "../utility.js";
import inquirer from "inquirer";
import fuzzy from "fuzzy";
import * as chrono from "chrono-node";
import getGitUsername from "git-user-name";
import inquirerDatepicker from "inquirer-datepicker";
import inquirerRecursive from "inquirer-recursive";
import inquirerAutocompletePrompt from "inquirer-autocomplete-prompt";
inquirer.registerPrompt("datepicker", inquirerDatepicker);
inquirer.registerPrompt("recursive", inquirerRecursive);
inquirer.registerPrompt("autocomplete", inquirerAutocompletePrompt);
async function interactive(taskData, taskIds, columnName, columnNames) {
  const dueDateExists = "metadata" in taskData && "due" in taskData.metadata && taskData.metadata.due != null;
  const assignedExists = "metadata" in taskData && "assigned" in taskData.metadata && taskData.metadata.assigned != null;
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
    },
    {
      type: "confirm",
      name: "editDescription",
      message: "Edit description?",
      default: false
    },
    {
      type: "editor",
      name: "description",
      message: "Task description:",
      default: taskData.description,
      when: (answers) => answers.editDescription
    },
    {
      type: "list",
      name: "column",
      message: "Column:",
      default: columnName,
      choices: columnNames
    },
    {
      type: "expand",
      name: "editDue",
      message: "Edit or remove due date?",
      default: "none",
      when: (answers) => dueDateExists,
      choices: [
        {
          key: "e",
          name: "Edit",
          value: "edit"
        },
        {
          key: "r",
          name: "Remove",
          value: "remove"
        },
        new inquirer.Separator(),
        {
          key: "n",
          name: "Do nothing",
          value: "none"
        }
      ]
    },
    {
      type: "confirm",
      name: "setDue",
      message: "Set a due date?",
      default: false,
      when: (answers) => !dueDateExists
    },
    {
      type: "datepicker",
      name: "due",
      message: "Due date:",
      default: dueDateExists ? taskData.metadata.due : /* @__PURE__ */ new Date(),
      format: ["Y", "/", "MM", "/", "DD"],
      when: (answers) => answers.setDue || answers.editDue === "edit"
    },
    {
      type: "expand",
      name: "editAssigned",
      message: "Edit or remove assigned user?",
      default: "none",
      when: (answers) => assignedExists,
      choices: [
        {
          key: "e",
          name: "Edit",
          value: "edit"
        },
        {
          key: "r",
          name: "Remove",
          value: "remove"
        },
        new inquirer.Separator(),
        {
          key: "n",
          name: "Do nothing",
          value: "none"
        }
      ]
    },
    {
      type: "confirm",
      name: "setAssigned",
      message: "Assign this task?",
      default: false,
      when: (answers) => !assignedExists
    },
    {
      type: "input",
      name: "assigned",
      message: "Assigned to:",
      default: assignedExists ? taskData.metadata.assigned : getGitUsername(),
      when: (answers) => answers.setAssigned || answers.editAssigned === "edit"
    },
    {
      type: "recursive",
      name: "addSubTasks",
      initialMessage: "Add a sub-task?",
      message: "Add another sub-task?",
      default: false,
      prompts: [
        {
          type: "input",
          name: "text",
          message: "Sub-task text:",
          validate: (value) => {
            if (!value) {
              return "Sub-task text cannot be empty";
            }
            return true;
          }
        },
        {
          type: "confirm",
          name: "completed",
          message: "Sub-task completed?",
          default: false
        }
      ]
    },
    {
      type: "recursive",
      name: "editSubTasks",
      initialMessage: "Update or remove a sub-task?",
      message: "Update or remove another sub-task?",
      default: false,
      when: (answers) => taskData.subTasks.length > 0,
      prompts: [
        {
          type: "list",
          name: "selectSubTask",
          message: "Which sub-task do you want to update or remove?",
          choices: taskData.subTasks.map((subTask) => subTask.text)
        },
        {
          type: "expand",
          name: "editSubTask",
          message: "Edit completion status or remove sub-task?",
          default: "none",
          choices: [
            {
              key: "e",
              name: "Edit completion status",
              value: "edit"
            },
            {
              key: "r",
              name: "Remove",
              value: "remove"
            },
            new inquirer.Separator(),
            {
              key: "n",
              name: "Do nothing",
              value: "none"
            }
          ]
        },
        {
          type: "confirm",
          name: "completed",
          message: "Sub-task completed?",
          default: (answers) => taskData.subTasks.find((subTask) => subTask.text === answers.selectSubTask).completed,
          when: (answers) => answers.editSubTask === "edit"
        }
      ]
    },
    {
      type: "recursive",
      name: "addTags",
      initialMessage: "Add a tag?",
      message: "Add another tag?",
      default: false,
      prompts: [
        {
          type: "input",
          name: "name",
          message: "Tag name:",
          validate: (value) => {
            if (!value) {
              return "Tag name cannot be empty";
            }
            return true;
          }
        }
      ]
    },
    {
      type: "recursive",
      name: "removeTags",
      initialMessage: "Remove a tag?",
      message: "Remove another tag?",
      default: false,
      when: (answers) => "metadata" in taskData && "tags" in taskData.metadata && taskData.metadata.tags.length > 0,
      prompts: [
        {
          type: "list",
          name: "selectTag",
          message: "Which tag do you want to remove?",
          choices: taskData.metadata.tags
        }
      ]
    },
    {
      type: "recursive",
      name: "addRelations",
      initialMessage: "Add a relation?",
      message: "Add another relation?",
      default: false,
      when: (answers) => taskIds.length > 0,
      prompts: [
        {
          type: "autocomplete",
          name: "task",
          message: "Related task id:",
          source: (answers, input) => {
            input = input || "";
            const result = fuzzy.filter(input, taskIds);
            return new Promise((resolve) => {
              resolve(result.map((result2) => result2.string));
            });
          }
        },
        {
          type: "input",
          name: "type",
          message: "Relation type:"
        }
      ]
    },
    {
      type: "recursive",
      name: "editRelations",
      initialMessage: "Update or remove a relation?",
      message: "Update or remove another relation?",
      default: false,
      when: (answers) => taskData.relations.length > 0,
      prompts: [
        {
          type: "list",
          name: "selectRelation",
          message: "Which relation do you want to update or remove?",
          choices: taskData.relations.map((relation) => relation.task)
        },
        {
          type: "expand",
          name: "editRelation",
          message: "Edit relation type or remove relation?",
          default: "none",
          choices: [
            {
              key: "e",
              name: "Edit relation type",
              value: "edit"
            },
            {
              key: "r",
              name: "Remove",
              value: "remove"
            },
            new inquirer.Separator(),
            {
              key: "n",
              name: "Do nothing",
              value: "none"
            }
          ]
        },
        {
          type: "input",
          name: "type",
          message: "Relation type:",
          default: (answers) => taskData.relations.find((relation) => relation.task === answers.selectRelation).task,
          when: (answers) => answers.editRelation === "edit"
        }
      ]
    }
  ]);
}
function updateTask(taskId, taskData, columnName) {
  kanbn.updateTask(taskId, taskData, columnName).then((taskId2) => {
    console.log(`Updated task "${taskId2}"`);
  }).catch((error) => {
    utility.error(error);
  });
}
var edit_default = async (args) => {
  if (!await kanbn.initialised()) {
    utility.error("Kanbn has not been initialised in this folder\nTry running: {b}kanbn init{b}");
    return;
  }
  const taskId = args._[1];
  if (!taskId) {
    utility.error('No task id specified\nTry running {b}kanbn edit "task id"{b}');
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
  let taskData;
  try {
    taskData = await kanbn.getTask(taskId);
  } catch (error) {
    utility.error(error);
    return;
  }
  let currentColumnName = await kanbn.findTaskColumn(taskId);
  let columnName = currentColumnName;
  if (args.column) {
    columnName = utility.strArg(args.column);
    if (columnNames.indexOf(columnName) === -1) {
      utility.error(`Column "${columnName}" doesn't exist`);
      return;
    }
  }
  const taskIds = [...await kanbn.findTrackedTasks()];
  if (args.name) {
    taskData.name = utility.strArg(args.name);
  }
  if (args.description) {
    taskData.description = utility.strArg(args.description);
  }
  if (args.due) {
    if (!("metadata" in taskData)) {
      taskData.metadata = {};
    }
    taskData.metadata.due = chrono.parseDate(utility.strArg(args.due));
    if (taskData.metadata.due === null) {
      utility.error("Unable to parse due date");
      return;
    }
  }
  if (args.progress) {
    if (!("metadata" in taskData)) {
      taskData.metadata = {};
    }
    const progressValue = parseFloat(utility.strArg(args.progress));
    if (isNaN(progressValue)) {
      utility.error("Progress value is not a number");
      return;
    }
    taskData.metadata.progress = progressValue;
  }
  if (args.assigned) {
    if (!("metadata" in taskData)) {
      taskData.metadata = {};
    }
    const gitUsername = getGitUsername();
    if (args.assigned === true) {
      if (gitUsername) {
        taskData.metadata.assigned = gitUsername;
      }
    } else {
      taskData.metadata.assigned = utility.strArg(args.assigned);
    }
  }
  if (args["remove-sub-task"]) {
    const removedSubTasks = utility.arrayArg(args["remove-sub-task"]);
    for (let removedSubTask2 of removedSubTasks) {
      if (taskData.subTasks.find((subTask) => subTask.text === removedSubTask2.text) === void 0) {
        utility.error(`Sub-task "${removedSubTask2.text}" doesn't exist`);
        return;
      }
    }
    taskData.subTasks = taskData.subTasks.filter((subTask) => removedSubTasks.indexOf(subTask.text) === -1);
  }
  if (args["sub-task"]) {
    const newSubTaskInputs = utility.arrayArg(args["sub-task"]);
    const newSubTasks = newSubTaskInputs.map((subTask) => {
      const match = subTask.match(/^\[([x ])\] (.*)/);
      if (match !== null) {
        return {
          completed: match[1] === "x",
          text: match[2]
        };
      }
      return {
        completed: false,
        text: subTask
      };
    });
    for (let newSubTask of newSubTasks) {
      const foundSubTask = taskData.subTasks.find((subTask) => subTask.text === newSubTask.text);
      if (foundSubTask === void 0) {
        taskData.subTasks.push(newSubTask);
      } else {
        foundSubTask.completed = newSubTask.completed;
      }
    }
  }
  if (args["remove-tag"]) {
    const removedTags = utility.arrayArg(args["remove-tag"]);
    if (!("metadata" in taskData) || !("tags" in taskData.metadata) || !Array.isArray(taskData.metadata.tags)) {
      utility.error("Task has no tags to remove");
      return;
    }
    for (let removedTag of removedTags) {
      if (taskData.metadata.tags.indexOf(removedTag) === -1) {
        utility.error(`Tag "${removedSubTask.text}" doesn't exist`);
        return;
      }
    }
    taskData.metadata.tags = taskData.metadata.tags.filter((tag) => removedTags.indexOf(tag) === -1);
  }
  if (args.tag) {
    const newTags = utility.arrayArg(args.tag);
    taskData.metadata.tags = [.../* @__PURE__ */ new Set([...taskData.metadata.tags || [], ...newTags])];
  }
  if (args["remove-relation"]) {
    const removedRelations = utility.arrayArg(args["remove-relation"]);
    for (let removedRelation of removedRelations) {
      if (taskData.relations.find((relation) => relation.task === removedRelation.task) === void 0) {
        utility.error(`Relation "${removedRelation.task}" doesn't exist`);
        return;
      }
    }
    taskData.relations = taskData.relations.filter((relation) => removedRelations.indexOf(relation.task) === -1);
  }
  if (args.relation) {
    const newRelationInputs = utility.arrayArg(args.relation);
    const newRelations = newRelationInputs.map((relation) => {
      const parts = relation.split(" ");
      return parts.length === 1 ? {
        type: "",
        task: parts[0].trim()
      } : {
        type: parts[0].trim(),
        task: parts[1].trim()
      };
    });
    for (let newRelation of newRelations) {
      const foundRelation = taskData.relations.find((relation) => relation.task === newRelation.task);
      if (foundRelation === void 0) {
        taskData.relations.push(newRelation);
      } else {
        foundRelation.type = newRelation.type;
      }
    }
  }
  if ("customFields" in index.options) {
    if (!("metadata" in taskData)) {
      taskData.metadata = {};
    }
    for (let arg of Object.keys(args)) {
      const removeCustomField = index.options.customFields.find((p) => `remove-${p.name}` === arg);
      if (removeCustomField !== void 0) {
        if (removeCustomField.name in taskData.metadata) {
          delete taskData.metadata[removeCustomField.name];
        }
      }
      const customField = index.options.customFields.find((p) => p.name === arg);
      if (customField !== void 0) {
        switch (customField.type) {
          case "boolean":
            if (typeof args[arg] === "boolean") {
              taskData.metadata[arg] = args[arg];
            } else {
              utility.error(`Custom field "${arg}" value is not a boolean`);
              return;
            }
            break;
          case "number":
            const numberValue = parseFloat(args[arg]);
            if (!isNaN(numberValue)) {
              taskData.metadata[arg] = numberValue;
            } else {
              utility.error(`Custom field "${arg}" value is not a number`);
              return;
            }
            break;
          case "string":
            if (typeof args[arg] === "string") {
              taskData.metadata[arg] = args[arg];
            } else {
              utility.error(`Custom field "${fieldName}" value is not a string`);
              return;
            }
            break;
          case "date":
            const dateValue = chrono.parseDate(args[arg]);
            if (dateValue instanceof Date) {
              taskData.metadata[arg] = dateValue;
            } else {
              utility.error(`Unable to parse date for custom field "${arg}"`);
              return;
            }
            break;
          default:
            break;
        }
      }
    }
  }
  if (args.interactive) {
    interactive(taskData, taskIds, columnName, columnNames).then((answers) => {
      taskData.name = answers.name;
      if ("description" in answers) {
        taskData.description = answers.description;
      }
      if ("editDue" in answers && answers.editDue === "remove") {
        delete taskData.metadata.due;
      }
      if ("due" in answers) {
        taskData.metadata.due = answers.due.toISOString();
      }
      if ("editAssigned" in answers && answers.editAssigned === "remove") {
        delete taskData.metadata.assigned;
      }
      if ("assigned" in answers) {
        taskData.metadata.assigned = answers.assigned;
      }
      if ("editSubTasks" in answers) {
        for (editSubTask of answers.editSubTasks) {
          const i = taskData.subTasks.findIndex((subTask) => subTask.task === editSubTask.selectSubTask);
          if (i !== -1) {
            switch (editSubTask.editSubTask) {
              case "remove":
                taskData.subTasks.splice(i, 1);
                break;
              case "edit":
                taskData.subTasks[i].completed = editSubTask.completed;
                break;
              default:
                break;
            }
          }
        }
      }
      if ("addSubTasks" in answers) {
        taskData.subTasks.push(...answers.addSubTasks.map((addSubTask) => ({
          text: addSubTask.text,
          completed: addSubTask.completed
        })));
      }
      if ("removeTags" in answers && "metadata" in taskData && "tags" in taskData.metadata) {
        for (removeTag of answers.removeTags) {
          const i = taskData.metadata.tags.indexOf(removeTag.name);
          if (i !== -1) {
            taskData.metadata.tags.splice(i, 1);
          }
        }
      }
      if ("addTags" in answers && "metadata" in taskData && "tags" in taskData.metadata) {
        taskData.metadata.tags.push(...answers.addTags.map((tag) => tag.name));
      }
      if ("editRelations" in answers) {
        for (editRelation of answers.editRelations) {
          const i = taskData.relations.findIndex((relation) => relation.task === editRelation.selectRelation);
          if (i !== -1) {
            switch (editRelation.editRelation) {
              case "remove":
                taskData.relations.splice(i, 1);
                break;
              case "edit":
                taskData.relations[i].type = editRelation.type;
                break;
              default:
                break;
            }
          }
        }
      }
      if ("addRelations" in answers) {
        taskData.relations.push(...answers.addRelations.map((addRelation) => ({
          task: addRelation.task,
          type: addRelation.type
        })));
      }
      columnName = answers.column !== currentColumnName ? answers.column : null;
      updateTask(taskId, taskData, columnName);
    }).catch((error) => {
      utility.error(error);
    });
  } else {
    columnName = columnName !== currentColumnName ? columnName : null;
    updateTask(taskId, taskData, columnName);
  }
};
export {
  edit_default as default
};
